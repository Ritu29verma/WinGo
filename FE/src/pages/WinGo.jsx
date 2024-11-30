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
    isWin: false,
    lotteryResult: null,
    bonus: null,
    period: null,
    autoClose: true,
    isVisible: false,
  });

  useEffect(() => {
    // Listen for betResults from the server
    socket.on("betResults", (betResults) => {
      if (betResults && betResults.length > 0) {
        // Find the first winning result
        const winningResult = betResults.find((result) => result.success);
        const resultToShow = winningResult || betResults[betResults.length - 1];

        // Update popupData state with the result to show
        setPopupData({
          isWin: resultToShow.success,
          lotteryResult: resultToShow.result,
          bonus: resultToShow.amount,
          period: resultToShow.period,
          autoClose: true,
          isVisible: true,
        });
      }
    });

    return () => {
      socket.off("betResults");
    };
  }, []);

  const handleClosePopup = () => {
    setPopupData((prev) => ({ ...prev, isVisible: false }));
  };

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
        isVisible={popupData.isVisible}
        onClose={handleClosePopup}
      />
    </div>
  );
};

export default WinGo;
