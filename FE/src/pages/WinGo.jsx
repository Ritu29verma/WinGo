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
    isVisible: false,
  });

  const [betResults, setBetResults] = useState([]); // Store all incoming bet results

  const handleClosePopup = () => {
    setPopupData((prev) => ({ ...prev, isVisible: false }));
    setBetResults([]);
  };

  useEffect(() => {
    if (!socket) {
      console.error("Socket is not defined");
      return;
    }

    const handleBetResult = (data) => {
      setBetResults((prevResults) => [...prevResults, data]); // Store all incoming results
    };

    socket.on("betResult", handleBetResult);

    return () => {
      socket.off("betResult", handleBetResult);
    };
  }, []);

  useEffect(() => {
    if (betResults.length > 0 && !popupData.isVisible) {
      // Find a winning bet first
      const winningBet = betResults.find((result) => result.success);

      const resultToShow = winningBet || betResults[0]; // Show a win if available, else any loss
      const { success, amount, period, result } = resultToShow;

      setPopupData({
        isWin: success,
        lotteryResult: result,
        bonus: amount,
        period,
        autoClose: true,
        isVisible: true, // Only show one popup
      });
    }
  }, [betResults, popupData.isVisible]);

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
