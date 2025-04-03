"use client";

import React, { useState, useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import orderService from "@/app/services/orderService";
import JacketCard from "@/app/components/cards/JacketCard";
import PantCard from "@/app/components/cards/PantCard";
import ShirtCard from "@/app/components/cards/ShirtCard";
import OrderPhotoCard from "@/app/components/cards/OrderPhotoCard";
import ItemsTable from "@/app/components/tables/ItemsTable";

interface Order {
  orderNo: string;
  note?: string;
  date?: string;
}

const OrderDetails = () => {
  const pathname = usePathname();
  const orderNo = pathname.split("/")[2];
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await orderService.getOrder(orderNo);
        setOrder(data);
      } catch (error) {
        console.error("Failed to fetch order details:", error);
      }
    };
    fetchOrder();
  }, [orderNo]);

  return (
    <>
      <div className="text-xl font-bold">{orderNo}</div>
      <div className="flex flex-row pt-10 space-x-5">
        <JacketCard orderNo={orderNo} />
        <PantCard orderNo={orderNo} />
        <ShirtCard orderNo={orderNo} />
      </div>
      <div className="pt-10">
        <div>Order Notes</div>
        <div>
          {order ? order.note || "No additional notes" : "Loading notes..."}
        </div>
      </div>
      <div className="pt-2">
        <OrderPhotoCard orderNo={orderNo} />
      </div>
      <div className="pt-2">
        <ItemsTable orderNo={orderNo} />
      </div>
    </>
  );
};

export default OrderDetails;
