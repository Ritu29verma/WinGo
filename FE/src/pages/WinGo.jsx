import React, { useState, useEffect } from "react";
import WalletSection from "../components/WalletSection";
import TimerSection from "../components/TimerSection";
import GameSection from "../components/GameSection";
import GameHistory from "../components/GameHistory";
import DetailsSection from "../components/DetailsSection";
import Header from "../components/Header";
import WinOrLoss from "../components/WinOrLoss";
import socket from "../socket";
import axios from "axios";
const WinGo = () => {
  const [selectedTime, setSelectedTime] = useState(30);
  const [popupData, setPopupData] = useState({
    isWin: false,
    lotteryResult: null,
    bonus: null,
    period: null,
    autoClose: true,
    isVisible: false,
  });
  const getEventName = (time) => {
    switch (time) {
      case 30:
        return "betResults";
      case 60:
        return "betResults2";
      case 180:
        return "betResults3";
      case 300:
        return "betResults4";
      default:
        return null;
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Call the sync-wallets API
      const syncWallets = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/auth/sync-wallets`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("Sync Wallets Response:", response.data);
        } catch (error) {
          console.error("Error syncing wallets:", error.response?.data || error.message);
        }
      };

      syncWallets();
    }
    // Listen for betResults from the server
    const eventName = getEventName(selectedTime);

    const handleBetResults = (betResults) => {
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
    };

    if (eventName) {
      socket.on(eventName, handleBetResults);
    }

    // Cleanup the event listener when the component unmounts or when selectedTime changes
    return () => {
      if (eventName) {
        socket.off(eventName, handleBetResults);
      }
    };
  }, [selectedTime]);

  const handleClosePopup = () => {
    setPopupData((prev) => ({ ...prev, isVisible: false }));
  };

  return (
    <div className="bg-black min-h-screen min-w-full">
      <Header isLogout={true} isWingo={false} />
      <div className="bg-gradient-to-r from-blue-900 via-blue-600 to-blue-400 min-w-full rounded-br-full rounded-bl-full mb-2 flex flex-col items-center">
        <WalletSection />
        <DetailsSection />
        <TimerSection selectedTime={selectedTime} setSelectedTime={setSelectedTime} />
      </div>
      {/* Pass selectedTime to GameSection and GameHistory */}
      <GameSection selectedTime={selectedTime} />
      <GameHistory selectedTime={selectedTime} />
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
