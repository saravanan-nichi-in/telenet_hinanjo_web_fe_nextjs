"use client";

import { useState } from "react";
import ActionButton from "../components/actionButton";
import TitleUserCard from "../components/titleUserCard";
import intl from "@/utils/locales/jp/jp.json";
export default function RemoteWipe() {
  return (
    <>
      <div className="flex justify-center mb-4 mt-2">
        <TitleUserCard title={intl.user_remote_wipe_screen_label} />
      </div>

      <div className="w-full mx-auto">
        <div className="mb-12 text-center font-semibold text-[#817E78]">
          データを消去しますか?
        </div>

        <div className="mb-0 flex gap-x-4 md:px-24">
          <ActionButton title={"いいえ"} />
          <ActionButton title={"はい"} />
        </div>
      </div>
    </>
  );
}
