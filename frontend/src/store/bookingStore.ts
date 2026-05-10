import {create} from "zustand";
import type { Booking } from "../@types/booking";
import axiosInstance from "../lib/axios";
import { toast } from "sonner";

interface BookingStore{
    newBooking:Booking |null;
    createBooking:(booking:Booking)=>Promise<void>;
    isCreatingBooking:boolean;
}

const useBookingStore =create<BookingStore>((set)=>({
    newBooking:null,
    
    isCreatingBooking:false,
    createBooking:async(booking:Booking) => {
        set({isCreatingBooking:true});
        try{
            const response=await axiosInstance.post('/booking/new-booking',booking);
            set({newBooking:response.data.booking});
            toast.success('Booking created successfully');
        }
        catch(error){
            toast.error('Failed to create booking: ',error.response?.data?.message || 'Unknown error');
        } finally{
            set({isCreatingBooking:false});
        }
    },
}));

export default useBookingStore;