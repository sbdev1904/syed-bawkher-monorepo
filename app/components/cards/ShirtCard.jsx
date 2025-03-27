"use client";
import React, { useEffect, useState } from "react";
import shirtService from "../../services/shirtService";
import EditMeasurementsButton from "../buttons/EditMeasurementsButton";
import { Button } from "antd";

const ShirtCard = ({ orderNo }) => {
  const [shirt, setShirt] = useState(null);

  useEffect(() => {
    const fetchShirt = async () => {
      try {
        const data = await shirtService.getShirtByOrderNo(orderNo);
        setShirt(data);
      } catch (error) {
        console.error("Failed to fetch pant measurements:", error);
      }
    };

    fetchShirt();
  }, [orderNo]);

  if (!shirt) {
    return <></>;
  }

  if (
    !shirt.length &&
    !shirt.half_shoulder &&
    !shirt.to_sleeve &&
    !shirt.chest &&
    !shirt.waist &&
    !shirt.collar &&
    !shirt.other_notes
  ) {
    return <></>;
  }

  return (
    <>
      <div className="bg-slate-700 rounded-lg shadow-lg text-white flex flex-col justify-between">
        <div className="text-lg text-gray-300 px-2 pt-2">
          Shirt Measurements
        </div>
        <div className="flex flex-col p-2">
          <div className="flex flex-row space-x-2">
            <div className="text-gray-400 font-light">Length: </div>
            <div>{shirt.length}</div>
          </div>
          <div className="flex flex-row space-x-2">
            <div className="text-gray-400 font-light">Half Shoulder: </div>
            <div>{shirt.half_shoulder}</div>
          </div>
          <div className="flex flex-row space-x-2">
            <div className="text-gray-400 font-light">To Sleeve: </div>
            <div>{shirt.to_sleeve}</div>
          </div>
          <div className="flex flex-row space-x-2">
            <div className="text-gray-400 font-light">Chest: </div>
            <div>{shirt.chest}</div>
          </div>
          <div className="flex flex-row space-x-2">
            <div className="text-gray-400 font-light">Waist: </div>
            <div>{shirt.waist}</div>
          </div>
          <div className="flex flex-row space-x-2">
            <div className="text-gray-400 font-light">Collar: </div>
            <div>{shirt.collar}</div>
          </div>
        </div>
        <div className="flex flex-row space-x-2 p-2">
          <div className="text-gray-400 font-light">Other Notes: </div>
          <div>{shirt.other_notes}</div>
        </div>
        <div className="flex flex-row p-2">
          <EditMeasurementsButton
            measurementType={"shirt"}
            measurement={shirt}
          />
        </div>
      </div>
    </>
  );
};

export default ShirtCard;
