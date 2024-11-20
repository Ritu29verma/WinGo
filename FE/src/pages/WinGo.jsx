import React, { useState } from "react";
import WalletSection from "../components/WalletSection";
import TimerSection from "../components/TimerSection";
import GameSection from "../components/GameSection";
import GameHistory from "../components/GameHistory";
import DetailsSection from "../components/DetailsSection"
const WinGo = () => {
    const [selectedTime, setSelectedTime] = useState(null);

    return (
        <div className="bg-black min-h-screen flex flex-col items-center">
            <div className="bg-gradient-to-r from-blue-900 via-blue-600 to-blue-400 min-w-full rounded-br-full rounded-bl-full mb-2 flex flex-col items-center">
         
        <WalletSection />
        <DetailsSection/>
        <TimerSection />
        </div>
        <GameSection />
        <GameHistory />
      </div>
    );
};

export default WinGo;
