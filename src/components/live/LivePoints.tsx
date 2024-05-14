import { useState, useEffect, useMemo } from 'react';
import { watchReadContract, readContract } from '@wagmi/core';
import { useAccount, useWalletClient } from "wagmi";
import { BigNumber } from "ethers";
import toast from "react-hot-toast";
import { MAD_SBT_CONTRACT_ADDRESS, REWARD_ENGAGEMENT_ACTION_MODULE } from '@/lib/consts';
import getActiveMadSBT from '@/services/madfi/getActiveMadSBT';
import { useIsProfileManager } from '@/services/lens/profileManagers';
import { useAuthenticatedProfileId } from '@/hooks/useLensLogin';
import { enableProfileManagerGasless } from '@/services/lens/profileManagers';

export const LivePoints = ({
  creatorAddress,
  isAuthenticated,
}) => {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { data: authenticatedProfileId } = useAuthenticatedProfileId();
  const { data: isProfileManager, refetch: fetchIsProfileManager } = useIsProfileManager(authenticatedProfileId, REWARD_ENGAGEMENT_ACTION_MODULE);
  const [activeMadSBTCollectionId, setActiveMadSBTCollectionId] = useState('');
  const [unwatchRewardUnits, setUnwatchRewardUnits] = useState<() => void>();
  const [rewardUnits, setRewardUnits] = useState<Number>(0);
  const [isEnabling, setIsEnabling] = useState<boolean>(false);

  useMemo(async () => {
    const activeCollectionId = await getActiveMadSBT(creatorAddress);
    setActiveMadSBTCollectionId(activeCollectionId);
  }, [creatorAddress])

  useEffect(() => {
    const fetchRewardUnitsWithWatch = async () => {
      const config = {
        address: MAD_SBT_CONTRACT_ADDRESS,
        abi: ["function rewardUnitsOf(address, uint256) external view returns (uint128)"],
        functionName: 'rewardUnitsOf',
        args: [address, 1]
      };
      const data = await readContract(config);
      setRewardUnits((data as BigNumber).toNumber());

      setUnwatchRewardUnits(watchReadContract(
        config,
        (data: BigNumber) => {
          console.log('sub!');
          console.log(data);
          toast(`+ ${data.toNumber()} MADx`);
          setRewardUnits(data.toNumber());
        },
      ));
    }

    if (activeMadSBTCollectionId) {
      fetchRewardUnitsWithWatch();
    }
  }, [activeMadSBTCollectionId]);

  const enableProfileManager = async () => {
    setIsEnabling(true);

    let toastId;
    try {
      toastId = toast.loading('Signing message to approve rewards as profile manager');

      await enableProfileManagerGasless(walletClient, REWARD_ENGAGEMENT_ACTION_MODULE);
      fetchIsProfileManager();

      toast.success(`Done! You can now claim rewards from rewarded publications`, { duration: 5_000, id: toastId });
    } catch(error) {
      console.log(error);
      toast.error('Error enabling profile manager', { id: toastId });
    }

    setIsEnabling(false);
  };

  if (!activeMadSBTCollectionId) return null;

  return (
    <div className="flex items-center space-x-2 py-4">
      {!isProfileManager && isAuthenticated && (
        <button
          className="w-fit rounded-full px-5 py-2 bg-almost-black text-white mr-4"
          onClick={enableProfileManager}
          disabled={isEnabling}
        >
          {isEnabling ? 'Waiting for tx...' : 'Enable rewards profile manager'}
        </button>
      )}
      <p>Your MADx balance: {rewardUnits.toString()}</p>
    </div>
  );
};