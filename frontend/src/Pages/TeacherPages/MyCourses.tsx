import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

const MyCourses=()=>{
    return(
        <div className="flex flex-col gap-5">
            {/* top section */}
            <div className="flex flex-row justify-between items-center">
                <div>
                    <p className="text-2xl font-medium text-text-strong">My Courses</p>
                    <p className="text-sm text-text-weak">Manage, edit, and track the performance of your educational content.</p>
                </div>
                <Button className="h-10 px-4 hover:bg-primary/80">
                    <Link to="/dashboard/my-courses/create" className="flex flex-row items-center gap-2">
                        <Plus /> <span className="font-medium">Create Course</span>
                    </Link>
                </Button>
            </div>
            {/* filter section */}
            <div>
                <Tabs defaultValue="all" className="flex flex-col gap-3">
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="published">Published</TabsTrigger>
                        <TabsTrigger value="draft">Draft</TabsTrigger>
                        <TabsTrigger value="archived">Archived</TabsTrigger>
                    </TabsList>
                    {/* courses section */}
                    <div className="border border-border rounded-lg p-5">
                        <TabsContent value="all">
                            <p className="text-text-strong text-xl font-medium">All courses</p>
                        </TabsContent>
                        <TabsContent value="published">
                            <p className="text-text-strong text-xl font-medium">Published courses</p>
                        </TabsContent>
                        <TabsContent value="draft">
                            <p className="text-text-strong text-xl font-medium">Draft courses</p>
                        </TabsContent>
                        <TabsContent value="archived">
                            <p className="text-text-strong text-xl font-medium">Archived courses</p>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
            
        </div>
    );
};
export default MyCourses;