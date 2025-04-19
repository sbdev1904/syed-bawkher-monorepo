"use client";
import React, { useEffect, useState } from "react";
import jacketService from "../../services/jacketService";
import EditMeasurementsButton from "../buttons/EditMeasurementsButton";

interface Jacket {
  measurement_id: string;
  collar: string;
  chest: string;
  waist: string;
  jacket_length: string;
  natural_length: string;
  back_length: string;
  x_back: string;
  half_shoulder: string;
  to_sleeve: string;
  waist_coat_length: string;
  sherwani_length: string;
  other_notes: string;
}

const JacketCard = ({ orderNo }: { orderNo: string }) => {
  const [jacket, setJacket] = useState<Jacket | null>(null);

  useEffect(() => {
    const fetchJacket = async () => {
      try {
        const data = await jacketService.getJacketByOrderNo(orderNo);
        setJacket(data);
      } catch (error) {
        console.error("Failed to fetch jacket measurements:", error);
      }
    };

    fetchJacket();
  }, [orderNo]);

  if (!jacket) {
    return <></>;
  }

  if (
    !jacket.collar &&
    !jacket.chest &&
    !jacket.waist &&
    !jacket.jacket_length &&
    !jacket.natural_length &&
    !jacket.back_length &&
    !jacket.x_back &&
    !jacket.half_shoulder &&
    !jacket.to_sleeve &&
    !jacket.waist_coat_length &&
    !jacket.sherwani_length &&
    !jacket.other_notes
  ) {
    return <></>;
  }

  return (
    <>
      <div className="bg-slate-700 rounded-lg p-3 border border-slate-600 flex flex-col justify-between">
        <div>
          <div className="text-lg text-gray-300 px-2 pt-2">
            Jacket Measurements
          </div>
        </div>
        <div className="flex flex-col p-2">
          <div className="flex flex-row space-x-2">
            <div className="text-gray-400 font-light">Jacket Length: </div>
            <div>{jacket.jacket_length}</div>
          </div>
          <div className="flex flex-row space-x-2">
            <div className="text-gray-400 font-light">Natural Length: </div>
            <div>{jacket.natural_length}</div>
          </div>
          <div className="flex flex-row space-x-2">
            <div className="text-gray-400 font-light">Back Length: </div>
            <div>{jacket.back_length}</div>
          </div>
          <div className="flex flex-row space-x-2">
            <div className="text-gray-400 font-light">Cross Back: </div>
            <div>{jacket.x_back}</div>
          </div>
          <div className="flex flex-row space-x-2">
            <div className="text-gray-400 font-light">Half Shoulder: </div>
            <div>{jacket.half_shoulder}</div>
          </div>
          <div className="flex flex-row space-x-2">
            <div className="text-gray-400 font-light">To Sleeve: </div>
            <div>{jacket.to_sleeve}</div>
          </div>
          <div className="flex flex-row space-x-2">
            <div className="text-gray-400 font-light">Chest: </div>
            <div>{jacket.chest}</div>
          </div>
          <div className="flex flex-row space-x-2">
            <div className="text-gray-400 font-light">Waist: </div>
            <div>{jacket.waist}</div>
          </div>
          <div className="flex flex-row space-x-2">
            <div className="text-gray-400 font-light">Collar: </div>
            <div>{jacket.collar}</div>
          </div>
          <div className="flex flex-row space-x-2">
            <div className="text-gray-400 font-light">Vest Coat Length: </div>
            <div>{jacket.waist_coat_length}</div>
          </div>
          <div className="flex flex-row space-x-2">
            <div className="text-gray-400 font-light">Sherwani Length: </div>
            <div>{jacket.sherwani_length}</div>
          </div>
        </div>
        <div className="flex flex-row space-x-2 p-2">
          <div className="text-gray-400 font-light">Other Notes: </div>
          <div>{jacket.other_notes}</div>
        </div>
        <div className="flex flex-row p-2">
          <EditMeasurementsButton
            measurementType={"jacket"}
            measurement={jacket}
          />
        </div>
      </div>
    </>
  );
};

export default JacketCard;
