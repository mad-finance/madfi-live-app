// v2 preview
export const LensHubProxy = [
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "publicationActedProfileId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "publicationActedId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "actorProfileId",
            "type": "uint256"
          },
          {
            "internalType": "uint256[]",
            "name": "referrerProfileIds",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256[]",
            "name": "referrerPubIds",
            "type": "uint256[]"
          },
          {
            "internalType": "address",
            "name": "actionModuleAddress",
            "type": "address"
          },
          {
            "internalType": "bytes",
            "name": "actionModuleData",
            "type": "bytes"
          }
        ],
        "internalType": "struct Types.PublicationActionParams",
        "name": "publicationActionParams",
        "type": "tuple"
      }
    ],
    "name": "act",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "publicationActedProfileId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "publicationActedId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "actorProfileId",
            "type": "uint256"
          },
          {
            "internalType": "uint256[]",
            "name": "referrerProfileIds",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256[]",
            "name": "referrerPubIds",
            "type": "uint256[]"
          },
          {
            "internalType": "address",
            "name": "actionModuleAddress",
            "type": "address"
          },
          {
            "internalType": "bytes",
            "name": "actionModuleData",
            "type": "bytes"
          }
        ],
        "internalType": "struct Types.PublicationActionParams",
        "name": "publicationActionParams",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "signer",
            "type": "address"
          },
          {
            "internalType": "uint8",
            "name": "v",
            "type": "uint8"
          },
          {
            "internalType": "bytes32",
            "name": "r",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "s",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
          }
        ],
        "internalType": "struct Types.EIP712Signature",
        "name": "signature",
        "type": "tuple"
      }
    ],
    "name": "actWithSig",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "delegatorProfileId",
        "type": "uint256"
      },
      {
        "internalType": "address[]",
        "name": "delegatedExecutors",
        "type": "address[]"
      },
      {
        "internalType": "bool[]",
        "name": "approvals",
        "type": "bool[]"
      },
      {
        "internalType": "uint64",
        "name": "configNumber",
        "type": "uint64"
      },
      {
        "internalType": "bool",
        "name": "switchToGivenConfig",
        "type": "bool"
      }
    ],
    "name": "changeDelegatedExecutorsConfig",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "delegatorProfileId",
        "type": "uint256"
      },
      {
        "internalType": "address[]",
        "name": "delegatedExecutors",
        "type": "address[]"
      },
      {
        "internalType": "bool[]",
        "name": "approvals",
        "type": "bool[]"
      }
    ],
    "name": "changeDelegatedExecutorsConfig",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "delegatorProfileId",
        "type": "uint256"
      },
      {
        "internalType": "address[]",
        "name": "delegatedExecutors",
        "type": "address[]"
      },
      {
        "internalType": "bool[]",
        "name": "approvals",
        "type": "bool[]"
      },
      {
        "internalType": "uint64",
        "name": "configNumber",
        "type": "uint64"
      },
      {
        "internalType": "bool",
        "name": "switchToGivenConfig",
        "type": "bool"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "signer",
            "type": "address"
          },
          {
            "internalType": "uint8",
            "name": "v",
            "type": "uint8"
          },
          {
            "internalType": "bytes32",
            "name": "r",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "s",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
          }
        ],
        "internalType": "struct Types.EIP712Signature",
        "name": "signature",
        "type": "tuple"
      }
    ],
    "name": "changeDelegatedExecutorsConfigWithSig",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "publicationCollectedProfileId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "publicationCollectedId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "collectorProfileId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "referrerProfileId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "referrerPubId",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "collectModuleData",
            "type": "bytes"
          }
        ],
        "internalType": "struct Types.LegacyCollectParams",
        "name": "collectParams",
        "type": "tuple"
      }
    ],
    "name": "collectLegacy",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "publicationCollectedProfileId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "publicationCollectedId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "collectorProfileId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "referrerProfileId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "referrerPubId",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "collectModuleData",
            "type": "bytes"
          }
        ],
        "internalType": "struct Types.LegacyCollectParams",
        "name": "collectParams",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "signer",
            "type": "address"
          },
          {
            "internalType": "uint8",
            "name": "v",
            "type": "uint8"
          },
          {
            "internalType": "bytes32",
            "name": "r",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "s",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
          }
        ],
        "internalType": "struct Types.EIP712Signature",
        "name": "signature",
        "type": "tuple"
      }
    ],
    "name": "collectLegacyWithSig",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "profileId",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "contentURI",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "pointedProfileId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "pointedPubId",
            "type": "uint256"
          },
          {
            "internalType": "uint256[]",
            "name": "referrerProfileIds",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256[]",
            "name": "referrerPubIds",
            "type": "uint256[]"
          },
          {
            "internalType": "bytes",
            "name": "referenceModuleData",
            "type": "bytes"
          },
          {
            "internalType": "address[]",
            "name": "actionModules",
            "type": "address[]"
          },
          {
            "internalType": "bytes[]",
            "name": "actionModulesInitDatas",
            "type": "bytes[]"
          },
          {
            "internalType": "address",
            "name": "referenceModule",
            "type": "address"
          },
          {
            "internalType": "bytes",
            "name": "referenceModuleInitData",
            "type": "bytes"
          }
        ],
        "internalType": "struct Types.CommentParams",
        "name": "commentParams",
        "type": "tuple"
      }
    ],
    "name": "comment",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "profileId",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "contentURI",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "pointedProfileId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "pointedPubId",
            "type": "uint256"
          },
          {
            "internalType": "uint256[]",
            "name": "referrerProfileIds",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256[]",
            "name": "referrerPubIds",
            "type": "uint256[]"
          },
          {
            "internalType": "bytes",
            "name": "referenceModuleData",
            "type": "bytes"
          },
          {
            "internalType": "address[]",
            "name": "actionModules",
            "type": "address[]"
          },
          {
            "internalType": "bytes[]",
            "name": "actionModulesInitDatas",
            "type": "bytes[]"
          },
          {
            "internalType": "address",
            "name": "referenceModule",
            "type": "address"
          },
          {
            "internalType": "bytes",
            "name": "referenceModuleInitData",
            "type": "bytes"
          }
        ],
        "internalType": "struct Types.CommentParams",
        "name": "commentParams",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "signer",
            "type": "address"
          },
          {
            "internalType": "uint8",
            "name": "v",
            "type": "uint8"
          },
          {
            "internalType": "bytes32",
            "name": "r",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "s",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
          }
        ],
        "internalType": "struct Types.EIP712Signature",
        "name": "signature",
        "type": "tuple"
      }
    ],
    "name": "commentWithSig",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "followModule",
            "type": "address"
          },
          {
            "internalType": "bytes",
            "name": "followModuleInitData",
            "type": "bytes"
          }
        ],
        "internalType": "struct Types.CreateProfileParams",
        "name": "createProfileParams",
        "type": "tuple"
      }
    ],
    "name": "createProfile",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "followerProfileId",
        "type": "uint256"
      },
      {
        "internalType": "uint256[]",
        "name": "idsOfProfilesToFollow",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "followTokenIds",
        "type": "uint256[]"
      },
      {
        "internalType": "bytes[]",
        "name": "datas",
        "type": "bytes[]"
      }
    ],
    "name": "follow",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "followerProfileId",
        "type": "uint256"
      },
      {
        "internalType": "uint256[]",
        "name": "idsOfProfilesToFollow",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "followTokenIds",
        "type": "uint256[]"
      },
      {
        "internalType": "bytes[]",
        "name": "datas",
        "type": "bytes[]"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "signer",
            "type": "address"
          },
          {
            "internalType": "uint8",
            "name": "v",
            "type": "uint8"
          },
          {
            "internalType": "bytes32",
            "name": "r",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "s",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
          }
        ],
        "internalType": "struct Types.EIP712Signature",
        "name": "signature",
        "type": "tuple"
      }
    ],
    "name": "followWithSig",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "profileId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "pubId",
        "type": "uint256"
      }
    ],
    "name": "getContentURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "delegatorProfileId",
        "type": "uint256"
      }
    ],
    "name": "getDelegatedExecutorsConfigNumber",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "delegatorProfileId",
        "type": "uint256"
      }
    ],
    "name": "getDelegatedExecutorsMaxConfigNumberSet",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "delegatorProfileId",
        "type": "uint256"
      }
    ],
    "name": "getDelegatedExecutorsPrevConfigNumber",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "profileId",
        "type": "uint256"
      }
    ],
    "name": "getProfile",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "pubCount",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "followModule",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "followNFT",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "__DEPRECATED__handle",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "__DEPRECATED__imageURI",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "__DEPRECATED__followNFTURI",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "metadataURI",
            "type": "string"
          }
        ],
        "internalType": "struct Types.Profile",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "profileId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "pubId",
        "type": "uint256"
      }
    ],
    "name": "getPublication",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "pointedProfileId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "pointedPubId",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "contentURI",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "referenceModule",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "__DEPRECATED__collectModule",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "__DEPRECATED__collectNFT",
            "type": "address"
          },
          {
            "internalType": "enum Types.PublicationType",
            "name": "pubType",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "rootProfileId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "rootPubId",
            "type": "uint256"
          }
        ],
        "internalType": "struct Types.PublicationMemory",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "profileId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "pubId",
        "type": "uint256"
      }
    ],
    "name": "getPublicationType",
    "outputs": [
      {
        "internalType": "enum Types.PublicationType",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint8",
        "name": "increment",
        "type": "uint8"
      }
    ],
    "name": "incrementNonce",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "profileId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "pubId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "module",
        "type": "address"
      }
    ],
    "name": "isActionModuleEnabledInPublication",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "profileId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "byProfileId",
        "type": "uint256"
      }
    ],
    "name": "isBlocked",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "delegatorProfileId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "delegatedExecutor",
        "type": "address"
      }
    ],
    "name": "isDelegatedExecutorApproved",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "delegatorProfileId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "delegatedExecutor",
        "type": "address"
      },
      {
        "internalType": "uint64",
        "name": "configNumber",
        "type": "uint64"
      }
    ],
    "name": "isDelegatedExecutorApproved",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "followerProfileId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "followedProfileId",
        "type": "uint256"
      }
    ],
    "name": "isFollowing",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "profileId",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "metadataURI",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "pointedProfileId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "pointedPubId",
            "type": "uint256"
          },
          {
            "internalType": "uint256[]",
            "name": "referrerProfileIds",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256[]",
            "name": "referrerPubIds",
            "type": "uint256[]"
          },
          {
            "internalType": "bytes",
            "name": "referenceModuleData",
            "type": "bytes"
          }
        ],
        "internalType": "struct Types.MirrorParams",
        "name": "mirrorParams",
        "type": "tuple"
      }
    ],
    "name": "mirror",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "profileId",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "metadataURI",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "pointedProfileId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "pointedPubId",
            "type": "uint256"
          },
          {
            "internalType": "uint256[]",
            "name": "referrerProfileIds",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256[]",
            "name": "referrerPubIds",
            "type": "uint256[]"
          },
          {
            "internalType": "bytes",
            "name": "referenceModuleData",
            "type": "bytes"
          }
        ],
        "internalType": "struct Types.MirrorParams",
        "name": "mirrorParams",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "signer",
            "type": "address"
          },
          {
            "internalType": "uint8",
            "name": "v",
            "type": "uint8"
          },
          {
            "internalType": "bytes32",
            "name": "r",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "s",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
          }
        ],
        "internalType": "struct Types.EIP712Signature",
        "name": "signature",
        "type": "tuple"
      }
    ],
    "name": "mirrorWithSig",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "profileId",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "contentURI",
            "type": "string"
          },
          {
            "internalType": "address[]",
            "name": "actionModules",
            "type": "address[]"
          },
          {
            "internalType": "bytes[]",
            "name": "actionModulesInitDatas",
            "type": "bytes[]"
          },
          {
            "internalType": "address",
            "name": "referenceModule",
            "type": "address"
          },
          {
            "internalType": "bytes",
            "name": "referenceModuleInitData",
            "type": "bytes"
          }
        ],
        "internalType": "struct Types.PostParams",
        "name": "postParams",
        "type": "tuple"
      }
    ],
    "name": "post",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "profileId",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "contentURI",
            "type": "string"
          },
          {
            "internalType": "address[]",
            "name": "actionModules",
            "type": "address[]"
          },
          {
            "internalType": "bytes[]",
            "name": "actionModulesInitDatas",
            "type": "bytes[]"
          },
          {
            "internalType": "address",
            "name": "referenceModule",
            "type": "address"
          },
          {
            "internalType": "bytes",
            "name": "referenceModuleInitData",
            "type": "bytes"
          }
        ],
        "internalType": "struct Types.PostParams",
        "name": "postParams",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "signer",
            "type": "address"
          },
          {
            "internalType": "uint8",
            "name": "v",
            "type": "uint8"
          },
          {
            "internalType": "bytes32",
            "name": "r",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "s",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
          }
        ],
        "internalType": "struct Types.EIP712Signature",
        "name": "signature",
        "type": "tuple"
      }
    ],
    "name": "postWithSig",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "profileId",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "contentURI",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "pointedProfileId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "pointedPubId",
            "type": "uint256"
          },
          {
            "internalType": "uint256[]",
            "name": "referrerProfileIds",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256[]",
            "name": "referrerPubIds",
            "type": "uint256[]"
          },
          {
            "internalType": "bytes",
            "name": "referenceModuleData",
            "type": "bytes"
          },
          {
            "internalType": "address[]",
            "name": "actionModules",
            "type": "address[]"
          },
          {
            "internalType": "bytes[]",
            "name": "actionModulesInitDatas",
            "type": "bytes[]"
          },
          {
            "internalType": "address",
            "name": "referenceModule",
            "type": "address"
          },
          {
            "internalType": "bytes",
            "name": "referenceModuleInitData",
            "type": "bytes"
          }
        ],
        "internalType": "struct Types.QuoteParams",
        "name": "quoteParams",
        "type": "tuple"
      }
    ],
    "name": "quote",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "profileId",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "contentURI",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "pointedProfileId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "pointedPubId",
            "type": "uint256"
          },
          {
            "internalType": "uint256[]",
            "name": "referrerProfileIds",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256[]",
            "name": "referrerPubIds",
            "type": "uint256[]"
          },
          {
            "internalType": "bytes",
            "name": "referenceModuleData",
            "type": "bytes"
          },
          {
            "internalType": "address[]",
            "name": "actionModules",
            "type": "address[]"
          },
          {
            "internalType": "bytes[]",
            "name": "actionModulesInitDatas",
            "type": "bytes[]"
          },
          {
            "internalType": "address",
            "name": "referenceModule",
            "type": "address"
          },
          {
            "internalType": "bytes",
            "name": "referenceModuleInitData",
            "type": "bytes"
          }
        ],
        "internalType": "struct Types.QuoteParams",
        "name": "quoteParams",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "signer",
            "type": "address"
          },
          {
            "internalType": "uint8",
            "name": "v",
            "type": "uint8"
          },
          {
            "internalType": "bytes32",
            "name": "r",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "s",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
          }
        ],
        "internalType": "struct Types.EIP712Signature",
        "name": "signature",
        "type": "tuple"
      }
    ],
    "name": "quoteWithSig",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "byProfileId",
        "type": "uint256"
      },
      {
        "internalType": "uint256[]",
        "name": "idsOfProfilesToSetBlockStatus",
        "type": "uint256[]"
      },
      {
        "internalType": "bool[]",
        "name": "blockStatus",
        "type": "bool[]"
      }
    ],
    "name": "setBlockStatus",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "byProfileId",
        "type": "uint256"
      },
      {
        "internalType": "uint256[]",
        "name": "idsOfProfilesToSetBlockStatus",
        "type": "uint256[]"
      },
      {
        "internalType": "bool[]",
        "name": "blockStatus",
        "type": "bool[]"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "signer",
            "type": "address"
          },
          {
            "internalType": "uint8",
            "name": "v",
            "type": "uint8"
          },
          {
            "internalType": "bytes32",
            "name": "r",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "s",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
          }
        ],
        "internalType": "struct Types.EIP712Signature",
        "name": "signature",
        "type": "tuple"
      }
    ],
    "name": "setBlockStatusWithSig",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "profileId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "followModule",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "followModuleInitData",
        "type": "bytes"
      }
    ],
    "name": "setFollowModule",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "profileId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "followModule",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "followModuleInitData",
        "type": "bytes"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "signer",
            "type": "address"
          },
          {
            "internalType": "uint8",
            "name": "v",
            "type": "uint8"
          },
          {
            "internalType": "bytes32",
            "name": "r",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "s",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
          }
        ],
        "internalType": "struct Types.EIP712Signature",
        "name": "signature",
        "type": "tuple"
      }
    ],
    "name": "setFollowModuleWithSig",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "profileId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "metadataURI",
        "type": "string"
      }
    ],
    "name": "setProfileMetadataURI",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "profileId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "metadataURI",
        "type": "string"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "signer",
            "type": "address"
          },
          {
            "internalType": "uint8",
            "name": "v",
            "type": "uint8"
          },
          {
            "internalType": "bytes32",
            "name": "r",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "s",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
          }
        ],
        "internalType": "struct Types.EIP712Signature",
        "name": "signature",
        "type": "tuple"
      }
    ],
    "name": "setProfileMetadataURIWithSig",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "unfollowerProfileId",
        "type": "uint256"
      },
      {
        "internalType": "uint256[]",
        "name": "idsOfProfilesToUnfollow",
        "type": "uint256[]"
      }
    ],
    "name": "unfollow",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "unfollowerProfileId",
        "type": "uint256"
      },
      {
        "internalType": "uint256[]",
        "name": "idsOfProfilesToUnfollow",
        "type": "uint256[]"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "signer",
            "type": "address"
          },
          {
            "internalType": "uint8",
            "name": "v",
            "type": "uint8"
          },
          {
            "internalType": "bytes32",
            "name": "r",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "s",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
          }
        ],
        "internalType": "struct Types.EIP712Signature",
        "name": "signature",
        "type": "tuple"
      }
    ],
    "name": "unfollowWithSig",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];