import React, { useState, useEffect } from "react";
import WalletSection from "../components/WalletSection";
import TimerSection from "../components/TimerSection";
import GameSection from "../components/GameSection";
import GameHistory from "../components/GameHistory";
import DetailsSection from "../components/DetailsSection";
import Header from "../components/Header";
import WinOrLoss from "../components/WinOrLoss";
import socket from "../socket";

const WinGo = () => {
  const [popupData, setPopupData] = useState({
    isWin: null,
    lotteryResult: {},
    bonus: null,
    period: null,
    autoClose: true,
    isVisible: false, // Track visibility
  });

  const handleClosePopup = () => {
    setPopupData((prev) => ({ ...prev, isVisible: false }));
  };

  useEffect(() => {
    if (!socket) {
      console.error("Socket is not defined");
      return;
    }

    const handleBetResult = (data) => {
      const { success, amount, period, result } = data;
      const { number, color, size } = result;

      setPopupData({
        isWin: success,
        lotteryResult: { number, color, size },
        bonus: amount,
        period: period,
        autoClose: true,
        isVisible: true, // Show the popup
      });
    };

    socket.on("betResult", handleBetResult);

    return () => {
      socket.off("betResult", handleBetResult);
    };
  }, [socket]);

  return (
    <div className="bg-black min-h-screen min-w-full">
      <Header isLogout={true} isWingo={false} />
      <div className="bg-gradient-to-r from-blue-900 via-blue-600 to-blue-400 min-w-full rounded-br-full rounded-bl-full mb-2 flex flex-col items-center">
        <WalletSection />
        <DetailsSection />
        <TimerSection />
      </div>
      <GameSection />
      <GameHistory />
      <WinOrLoss
        isWin={popupData.isWin}
        lotteryResult={popupData.lotteryResult}
        bonus={popupData.bonus}
        period={popupData.period}
        autoClose={popupData.autoClose}
        isVisible={popupData.isVisible} // Pass visibility state
        onClose={handleClosePopup} // Pass close handler
      />
    </div>
  );
};


export default WinGo;
