import { Calendar, Check, ClipboardCheck, ClipboardClock, ClipboardX, Clock, MessageSquare, User, X } from "lucide-react";
import useBookingStore from "../../store/bookingStore";
import { useEffect, useState } from "react";
import { Separator } from "../../components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";

const Bookings = () => {
    const {teacherBookings,isGettingTeacherBookings,getTeacherBookings}=useBookingStore();
    const pendingBookings=teacherBookings.filter((booking)=>booking.status==="pending");
    const approvedBookings=teacherBookings.filter((booking)=>booking.status==="approved");
    const rejectedBookings=teacherBookings.filter((booking)=>booking.status==="rejected");
    const cards=[
        {
            title:"pending bookings",
            value:pendingBookings.length,
            icon:ClipboardClock
        },
        {
            title:"approved bookings",
            value:approvedBookings.length,
            icon:ClipboardCheck
        },
        {
            title:"rejected bookings",
            value:rejectedBookings.length,
            icon:ClipboardX
        }
    ];
    const [filterTabs,setFilterTabs]=useState("all");
    const filteredBookings = teacherBookings.filter((booking)=>filterTabs==="all"|| booking.status === filterTabs);

    useEffect(() => {
        getTeacherBookings();
    }, []);

    if(isGettingTeacherBookings){
        return <SkeletonBookingState />;
    }
    if(teacherBookings.length ===0){
        return <EmptyBookingState />;
    }

    return (
        <div>
            {/* summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {cards.map((card, index) => (
                    <div key={index} className="bg-background border border-border/60 rounded-xl p-6 text-left hover:border-primary transition-all duration-200 shadow-sm group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                <card.icon className="w-6 h-6 text-primary" />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{card.title}</span>
                        </div>
                        <div className="text-3xl font-bold">{card.value}</div>
                    </div>
                ))}
            </div>
            <Separator className="my-4"/>
            {/* filter section */}
            <Tabs defaultValue={filterTabs} onValueChange={(value)=>setFilterTabs(value)}>
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="approved">Approved</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>
                {/* booking list */}
                <div className="mt-6 space-y-4">
                    {filteredBookings.length > 0 ? (
                        filteredBookings.map((booking) => {
                            return (
                                <div key={booking.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-background border border-border/60 rounded-xl hover:shadow-md transition-all duration-200 gap-4 group">
                                    <div className="flex items-center gap-4 w-full md:w-auto">
                                        <Avatar className="h-12 w-12 border-2 border-primary/10">
                                            <AvatarImage src={booking.student.user?.avatar} />
                                            <AvatarFallback className="bg-primary/5 text-primary font-semibold">
                                                {booking.student.user.name[0].toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{booking.student.user.name}</h2>
                                            <div className="flex items-center gap-3 mt-1">
                                                <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-secondary/30 px-2 py-0.5 rounded-md">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    <span>{booking.scheduled_day}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-secondary/30 px-2 py-0.5 rounded-md">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    <span>{booking.scheduled_time}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-2 md:gap-1">
                                        <div className="text-xl font-bold text-foreground">${booking.price}</div>
                                        <div className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                                            booking.status === 'approved' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                                            booking.status === 'rejected' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                                            'bg-amber-100 text-amber-700 border border-amber-200'
                                        }`}>
                                            {booking.status}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-border/40">
                                        {booking.status === 'pending' && (
                                            <>
                                                <Button variant="default" size="sm" className="flex-1 md:flex-none bg-primary hover:bg-primary/90 text-white h-9">
                                                    <Check className="w-4 h-4 mr-2" />
                                                    Approve
                                                </Button>
                                                <Button variant="outline" size="sm" className="flex-1 md:flex-none border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 h-9">
                                                    <X className="w-4 h-4 mr-2" />
                                                    Reject
                                                </Button>
                                            </>
                                        )}
                                        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10 ml-auto md:ml-0">
                                            <MessageSquare className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-12 border border-dashed border-border rounded-xl">
                            <p className="text-muted-foreground font-medium">No bookings found for this filter.</p>
                        </div>
                    )}
                </div>
            </Tabs>
        </div>
    );
};

// empty booking state
const EmptyBookingState = () => {
    return (
        <div className="text-center p-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary mb-4">
                <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">No Bookings Yet</h1>
            <p className="text-gray-500 mb-8">You're all caught up. Check back later when students start booking lessons with you.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
                {/* Placeholder Stats */}
                <div className="bg-background border border-border/60 rounded-xl p-6 text-left hover:border-primary transition-colors">
                    <div className="text-sm text-muted-foreground mb-2">Total Bookings</div>
                    <div className="text-3xl font-bold">0</div>
                </div>
                <div className="bg-background border border-border/60 rounded-xl p-6 text-left hover:border-primary transition-colors">
                    <div className="text-sm text-muted-foreground mb-2">Total Earnings</div>
                    <div className="text-3xl font-bold">$0</div>
                </div>
                <div className="bg-background border border-border/60 rounded-xl p-6 text-left hover:border-primary transition-colors">
                    <div className="text-sm text-muted-foreground mb-2">Upcoming</div>
                    <div className="text-3xl font-bold">0</div>
                </div>
            </div>
        </div>
    );
};

// skeleton loading 
const SkeletonBookingState = () => {
    return (
        <div className="animate-pulse space-y-6">
            {/* Skeleton for cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-background border border-border/60 rounded-xl p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="w-10 h-10 bg-secondary rounded-lg"></div>
                            <div className="w-24 h-4 bg-secondary rounded"></div>
                        </div>
                        <div className="w-16 h-8 bg-secondary rounded"></div>
                    </div>
                ))}
            </div>
            
            <div className="h-10 w-64 bg-secondary rounded-md"></div>

            <div className="space-y-4">
                {/* Skeleton for each booking card */}
                {[...Array(4)].map((_, index) => (
                    <div
                        key={index}
                        className="bg-background rounded-xl border border-border/60 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="w-12 h-12 rounded-full bg-secondary"></div>
                            <div className="space-y-2">
                                <div className="h-5 bg-secondary rounded w-32"></div>
                                <div className="flex gap-2">
                                    <div className="h-4 bg-secondary rounded w-20"></div>
                                    <div className="h-4 bg-secondary rounded w-20"></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-2">
                            <div className="h-6 bg-secondary rounded w-16"></div>
                            <div className="h-4 bg-secondary rounded w-20"></div>
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-border/40">
                            <div className="h-9 bg-secondary rounded w-24"></div>
                            <div className="h-9 bg-secondary rounded w-24"></div>
                            <div className="h-9 w-9 bg-secondary rounded-md ml-auto md:ml-0"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Bookings;