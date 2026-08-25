#!/usr/bin/env bash
# Azure Files & Key Vault State Sync Script for 3-Minute Video Animation Helper
# Usage:
#   ./scripts/azure_sync.sh status
#   ./scripts/azure_sync.sh push
#   ./scripts/azure_sync.sh pull

set -e

KEYVAULT_NAME="dp-kv-deliverypilot"
STORAGE_ACCOUNT="animationasistant"
FILE_SHARE="aug-video-state"
REMOTE_FILE="aug_video_animation_state.json"
LOCAL_STATE_FILE="state/aug_video_animation_state.json"

mkdir -p state

echo "=========================================================="
echo "☁️  Azure Files & Key Vault State Sync - aug-video-animation-3"
echo "=========================================================="

# 1. Verify az login
if ! az account show > /dev/null 2>&1; then
  echo "⚠️ Azure CLI not logged in. Running 'az login'..."
  az login
fi

AZ_USER=$(az account show --query "user.name" -o tsv)
AZ_SUB=$(az account show --query "name" -o tsv)
echo "✅ Logged in as: ${AZ_USER} (${AZ_SUB})"

# 2. Fetch Storage Key from Azure Key Vault
echo "🔐 Fetching storage credentials from Key Vault [${KEYVAULT_NAME}]..."
STORAGE_KEY=$(az keyvault secret show --vault-name "${KEYVAULT_NAME}" --name "aug-video-storage-key" --query "value" -o tsv 2>/dev/null || true)

if [ -z "${STORAGE_KEY}" ]; then
  echo "⚠️ Falling back to direct storage account keys..."
  STORAGE_KEY=$(az storage account keys list --account-name "${STORAGE_ACCOUNT}" --query "[0].value" -o tsv)
fi

ACTION="${1:-status}"

case "${ACTION}" in
  push)
    echo "📤 Uploading local state [${LOCAL_STATE_FILE}] to Azure Files [${STORAGE_ACCOUNT}/${FILE_SHARE}/${REMOTE_FILE}]..."
    if [ ! -f "${LOCAL_STATE_FILE}" ]; then
      echo "⚠️ Local state file not found. Creating default state file..."
      cat <<EOF > "${LOCAL_STATE_FILE}"
{
  "updatedAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "project": "aug-video-animation-3",
  "completedScenes": {},
  "stageChecklist": {},
  "syncedBy": "${AZ_USER}"
}
EOF
    fi

    az storage file upload \
      --account-name "${STORAGE_ACCOUNT}" \
      --account-key "${STORAGE_KEY}" \
      --share-name "${FILE_SHARE}" \
      --source "${LOCAL_STATE_FILE}" \
      --path "${REMOTE_FILE}" \
      -o table

    echo "✅ State successfully uploaded to Azure Files!"
    ;;

  pull)
    echo "📥 Downloading remote state from Azure Files [${STORAGE_ACCOUNT}/${FILE_SHARE}/${REMOTE_FILE}]..."
    az storage file download \
      --account-name "${STORAGE_ACCOUNT}" \
      --account-key "${STORAGE_KEY}" \
      --share-name "${FILE_SHARE}" \
      --path "${REMOTE_FILE}" \
      --dest "${LOCAL_STATE_FILE}" \
      -o table

    echo "✅ State successfully pulled to [${LOCAL_STATE_FILE}]!"
    cat "${LOCAL_STATE_FILE}"
    ;;

  status)
    echo "🔍 Checking Azure Files Share status [${STORAGE_ACCOUNT}/${FILE_SHARE}]..."
    az storage file list \
      --account-name "${STORAGE_ACCOUNT}" \
      --account-key "${STORAGE_KEY}" \
      --share-name "${FILE_SHARE}" \
      -o table
    ;;

  *)
    echo "Usage: $0 {status|push|pull}"
    exit 1
    ;;
esac
