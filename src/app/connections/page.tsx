'use client'

import { BlingAuthConnect } from '@/components/ApisAuthConnect/blingAuthConnect/BlingAuthConnect';
import { OlistAuthConnect } from '@/components/ApisAuthConnect/OlistAuthConnect/OlistAuthConnect';
import ConfigLayoutPage from "@/components/configLayoutPage/page";

const ContentPageMyConnections = () => {
  return(
    <section className="w-full h-full flex flex-col mt-[100px] items-center">
      <BlingAuthConnect />
      <OlistAuthConnect />
    </section>
  );
}

const connections = () => {
  return (
    <>
      <ConfigLayoutPage content={<ContentPageMyConnections/>} />
    </>
  );
};

export default connections;
