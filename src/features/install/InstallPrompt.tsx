import React from "react";
import BottomSheet from "../../bottomSheet/BottomSheet";
import { isInstalled } from "../../helpers/device";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { promptToAddToHomeScreen } from "./installSlice";
import Promo from "./Promo";

const open = (() => {
  const url = new URL(window.location.href);

  if (url.searchParams.get("installApp")) {
    url.searchParams.delete("installApp");
    window.history.replaceState(null, "", url.href);
    return true;
  }

  return false;
})();

export default function InstallPrompt() {
  const dispatch = useAppDispatch();
  const beforeInstallEvent = useAppSelector(
    (state) => state.install.beforeInstallEvent
  );

  function renderiPhonePromo() {
    return (
      <>
        <BottomSheet
          openButton={<Promo />}
          title="Install the app"
          open={open}
        ></BottomSheet>
      </>
    );
  }

  if (isInstalled()) return <></>;
  if (navigator.userAgent.match(/iPhone/i)) return renderiPhonePromo();
  if (!beforeInstallEvent) return <></>;

  return (
    <Promo
      onClick={() => {
        beforeInstallEvent.prompt();
        dispatch(promptToAddToHomeScreen());
      }}
    />
  );
}