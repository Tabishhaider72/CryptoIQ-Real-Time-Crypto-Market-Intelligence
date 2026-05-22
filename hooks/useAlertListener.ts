"use client";

import { useEffect } from "react";

import { socket }
from "@/lib/socketClient";

import {
 toast
}
from "sonner";

export function
useAlertListener() {

 useEffect(() => {

   socket.on(
     "alert:trigger",

     (data) => {

       toast.success(
         `${data.coin}
         ${data.condition}
         ${data.target}

         Current:
         ${data.price}`
       );
     }
   );

   return () => {

     socket.off(
       "alert:trigger"
     );

   };

 }, []);

}