import { getUrlForImageFromIpfs } from "@/utils";
import axios from "axios";
import { utils } from "ethers";
import { useEffect, useState } from "react";

interface Activity {
  numGuests: number;
  drop: any;
  decentContract?: any;
  handle: string;
  spinampPlaylistId: string;
  createdAt: number;
  startAt: number;
  totalSales: string;
  totalSalesAmount?: string;
}

const ActivityItem = ({ activity }: { activity: Activity }) => {
  const drop = activity.decentContract || activity.drop;

  if (!drop) return;

  // get days passed since space was live
  const activityTime = () => {
    const now = new Date();
    const startedAt = activity.startAt || activity.createdAt;
    const timePassed = Number(now) - startedAt * 1000;
    if (timePassed > 86400000) {
      const days = Math.floor(timePassed / 86400000);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else {
      const hours = Math.floor(timePassed / 3600000);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    }
  };

  const isVideo = () => drop.isVideo || drop.image.endsWith(".mp4");

  return (
    <div className="p-3 rounded-xl min-w-[240px] border-slate-500 border-[1px]">
      {!isVideo() ? (
        <img src={getUrlForImageFromIpfs(drop.image)} width="220" height="220" className="rounded-xl mb-2" />
      ) : (
        <video
          src={getUrlForImageFromIpfs(drop.image)}
          width="220"
          height="220"
          className="rounded-xl mb-2"
          autoPlay
          muted
          loop
        />
      )}
      <p className="text-xl font-semibold">{drop.name}</p>
      <p>@{activity.handle}</p>
      <p>{activity.numGuests} attendees</p>
      <p>
        {utils.formatEther(activity.totalSales)} {drop.chainId === 137 ? "MATIC" : "ETH"} raised
      </p>
      {activity.totalSalesAmount && <p>{activity.totalSalesAmount} minted</p>}
      <p>{activityTime()}</p>
    </div>
  );
};

const ActivityFeed = () => {
  const [hostedSpaces, setHostedSpaces] = useState([]);
  useEffect(() => {
    const _fetchAsync = async () => {
      const { data } = await axios.get(`/api/mongo/activity-feed`);
      setHostedSpaces(data);
    };
    _fetchAsync();
  }, []);

  return (
    <div className="w-full mb-16">
      {hostedSpaces.length > 0 && (
        <>
          <h2 className="text-md font-bold tracking-tight text-3xl mt-16 mb-8">Recent Spaces</h2>
          <div className="flex overflow-auto gap-8">
            {hostedSpaces
              .map((activity: Activity, i: number) => <ActivityItem key={i} activity={activity} />)
              .filter((a) => a)}
          </div>
        </>
      )}
    </div>
  );
};

export default ActivityFeed;
