import React, { useState } from "react";
import WalletSection from "../components/WalletSection";
import TimerSection from "../components/TimerSection";
import GameSection from "../components/GameSection";
import GameHistory from "../components/GameHistory";
const WinGo = () => {
    const [selectedTime, setSelectedTime] = useState(null);

    return (
        <div className="bg-black min-h-screen flex flex-col items-center">
            <div className="bg-gradient-to-r from-blue-900 via-blue-600 to-blue-400 min-w-full rounded-br-3xl rounded-bl-3xl flex flex-col items-center">
         
        <WalletSection />
        <TimerSection />
        </div>
        <GameSection />
        <GameHistory />
      </div>
    );
};

export default WinGo;
