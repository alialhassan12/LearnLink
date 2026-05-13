import { useEffect, useState } from "react";
import { useLiveSessionStore } from "../../../store/liveSessionsStore";
import { Calendar, Clock, ClockCheck, Video } from "lucide-react";
import { Separator } from "../../../components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { Skeleton } from "../../../components/ui/skeleton";
import { Button } from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";

const MySessions = () => {
    const { getTeacherLiveSessions, teacherLiveSessions, isGettingTeacherLiveSessions } = useLiveSessionStore();
    const [filterTabs, setFilterTabs] = useState<string>("all");
    const filteredSessions = teacherLiveSessions.filter((session) => filterTabs === "all" || filterTabs === session.status);
    const navigate=useNavigate();

    useEffect(() => {
        getTeacherLiveSessions();
    }, []);

    const cards = [
        {
            id: 1,
            title: "Upcoming Sessions",
            value: teacherLiveSessions.filter((session) => session.status === "booked").length,
            icon: Clock
        },
        {
            id: 2,
            title: "Completed Sessions",
            value: teacherLiveSessions.filter((session) => session.status === "completed").length,
            icon: ClockCheck
        },
        {
            id: 3,
            title: "Today's Sessions",
            value: teacherLiveSessions.filter((session) => new Date(session.scheduled_date).toDateString() === new Date().toDateString()).length,
            icon: Calendar
        }
    ];

    if (isGettingTeacherLiveSessions) {
        return <MySessionsSkeleton />;
    }

    return (
        <div className="space-y-6">
            {/* summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cards.map((card) => (
                    <div key={card.id} className="bg-card p-6 rounded-xl shadow-sm border border-border/60 hover:border-primary transition-all duration-300 group">
                        <div className="flex flex-row justify-between items-center">
                            <div className="p-2.5 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <card.icon className="w-6 h-6 text-primary" />
                            </div>
                            <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">{card.title}</p>
                        </div>
                        <div className="mt-4">
                            <p className="text-foreground font-bold text-3xl">{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <Separator className="my-2" />

            {/* live sessions list */}
            <Tabs defaultValue={filterTabs} onValueChange={(value) => setFilterTabs(value)}>
                <TabsList className="w-full sm:w-auto flex flex-wrap h-auto justify-start bg-transparent p-0 gap-2 mb-6">
                    <TabsTrigger value="all" className="px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border border-border rounded-lg transition-all">All Sessions</TabsTrigger>
                    <TabsTrigger value="booked" className="px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border border-border rounded-lg transition-all">Upcoming</TabsTrigger>
                    <TabsTrigger value="completed" className="px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border border-border rounded-lg transition-all">Completed</TabsTrigger>
                    <TabsTrigger value="cancelled" className="px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border border-border rounded-lg transition-all">Cancelled</TabsTrigger>
                </TabsList>

                <div className="grid grid-cols-1 gap-4">
                    {filteredSessions.length > 0 ? (
                        filteredSessions.map((session) => {
                            return (
                                <div key={session.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card rounded-xl p-5 border border-border/60 hover:border-primary hover:shadow-md transition-all duration-300">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-12 h-12 border-2 border-primary/10">
                                                <AvatarImage src={session.student?.user?.avatar} />
                                                <AvatarFallback className="bg-primary/5 text-primary font-semibold text-lg">{session.student?.user?.name ? session.student.user.name[0] : 'S'}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-foreground font-semibold text-lg">{session.student?.user?.name}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                                                        session.status === 'booked' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                                        session.status === 'completed' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                                                        'bg-rose-100 text-rose-700 border border-rose-200'
                                                    }`}>
                                                        {session.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <Separator orientation="vertical" className="hidden sm:block h-10 mx-2" />
                                        
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="w-4 h-4 text-primary/70" />
                                                <span>{new Date(session.scheduled_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Clock className="w-4 h-4 text-primary/70" />
                                                <span>{session.scheduled_time}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                                        <Button
                                            onClick={()=>navigate(`/dashboard/my-sessions/view/${session?.id}`)}
                                            className="flex-1 md:flex-none bg-primary hover:bg-primary/90 text-white shadow-sm transition-all hover:scale-[1.02]">
                                            <Video className="w-4 h-4 mr-2" />
                                            {session.status=="booked"? "Start Session": "View Session"}
                                        </Button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-muted/5 rounded-xl border border-dashed border-border">
                            <Calendar className="w-12 h-12 text-muted-foreground/30 mb-4" />
                            <p className="text-muted-foreground font-medium">No sessions found for this category</p>
                        </div>
                    )}
                </div>
            </Tabs>
        </div>
    );
};

const MySessionsSkeleton = () => {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-card p-6 rounded-xl border border-border/60 space-y-4">
                        <div className="flex justify-between items-center">
                            <Skeleton className="w-10 h-10 rounded-lg" />
                            <Skeleton className="w-24 h-4" />
                        </div>
                        <Skeleton className="w-16 h-8" />
                    </div>
                ))}
            </div>
            
            <Separator className="my-2" />
            
            <div className="flex flex-wrap gap-2 mb-6">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="w-24 h-10 rounded-lg" />
                ))}
            </div>
            
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card rounded-xl p-5 border border-border/60">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="flex items-center gap-3">
                                <Skeleton className="w-12 h-12 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="w-32 h-5" />
                                    <Skeleton className="w-20 h-4 rounded-full" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="w-48 h-4" />
                                <Skeleton className="w-32 h-4" />
                            </div>
                        </div>
                        <Skeleton className="w-full md:w-32 h-10 rounded-md" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MySessions;