"use client";
import React, { useEffect, useState } from "react";
import pantService from "../../services/pantService";
import EditMeasurementsButton from "../buttons/EditMeasurementsButton";

interface PantMeasurement {
  measurement_id: string;
  length: string;
  inseem: string;
  waist: string;
  hips: string;
  bottom: string;
  knee: string;
  other_notes: string;
}

interface PantCardProps {
  orderNo: string;
}

const PantCard: React.FC<PantCardProps> = ({ orderNo }) => {
  const [pant, setPant] = useState<PantMeasurement | null>(null);

  useEffect(() => {
    const fetchPant = async () => {
      try {
        const data = await pantService.getPantByOrderNo(orderNo);
        setPant(data);
      } catch (error) {
        console.error("Failed to fetch pant measurements:", error);
      }
    };

    fetchPant();
  }, [orderNo]);

  if (!pant) {
    return <></>;
  }

  if (
    !pant.length &&
    !pant.inseem &&
    !pant.waist &&
    !pant.hips &&
    !pant.bottom &&
    !pant.knee &&
    !pant.other_notes
  ) {
    return <></>;
  }

  return (
    <>
      <div className="bg-slate-700 rounded-lg p-3 border border-slate-600 flex flex-col justify-between">
        <div className="text-lg text-gray-300 px-2 pt-2">Pant Measurements</div>
        <div className="flex flex-col p-2">
          <div className="flex flex-row space-x-2">
            <div className="text-gray-400 font-light">Length: </div>
            <div>{pant.length}</div>
          </div>
          <div className="flex flex-row space-x-2">
            <div className="text-gray-400 font-light">Inseem: </div>
            <div>{pant.inseem}</div>
          </div>
          <div className="flex flex-row space-x-2">
            <div className="text-gray-400 font-light">Waist: </div>
            <div>{pant.waist}</div>
          </div>
          <div className="flex flex-row space-x-2">
            <div className="text-gray-400 font-light">Hips: </div>
            <div>{pant.hips}</div>
          </div>
          <div className="flex flex-row space-x-2">
            <div className="text-gray-400 font-light">Bottom: </div>
            <div>{pant.bottom}</div>
          </div>
          <div className="flex flex-row space-x-2">
            <div className="text-gray-400 font-light">Knee: </div>
            <div>{pant.knee}</div>
          </div>
        </div>
        <div className="flex flex-row space-x-2 p-2">
          <div className="text-gray-400 font-light">Other Notes: </div>
          <div>{pant.other_notes}</div>
        </div>
        <div className="flex flex-row p-2">
          <EditMeasurementsButton measurementType={"pant"} measurement={pant} />
        </div>
      </div>
    </>
  );
};

export default PantCard;
