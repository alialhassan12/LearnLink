import { Search } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import useBrowseStore from "../../../store/studentmarketplaceStores/browseStore";
import { useEffect } from "react";
import { Skeleton } from "../../../components/ui/skeleton";
import { NativeSelect, NativeSelectOption } from "../../../components/ui/native-select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../../../components/ui/sheet";
import { Filter } from "lucide-react";
import TeacherFilterSection from "../../../components/studentMarketplaceComponents/TeacherFilterSection";
import TeacherCard from "../../../components/studentMarketplaceComponents/TeacherCard";
import TeacherCardSkeleton from "../../../components/studentMarketplaceComponents/TeacherCardSkeleton";


const BrowseTeachers = () => {
    const {getSubjects,isGettingFilters,subjects,getLanguages,languages,setIsGettingFilters,teachers,getTeachers,isGettingTeachers}=useBrowseStore();
    
    const getFilters=async()=>{
        setIsGettingFilters(true);
        await getSubjects();
        await getLanguages();
        setIsGettingFilters(false);
    }

    useEffect(() => {
        if(languages.length === 0 && subjects.length === 0){
            getFilters();
        }
        if(teachers.length === 0){
            getTeachers();
        }
    }, []);

    // handlers

    return (
        <div className="px-10 py-10">

            {/* top search bar */}
            <div data-aos="fade-down" className="flex flex-col gap-4 justify-center items-center my-6 md:my-10 px-4">
                {/* title */}
                <h1 className="text-2xl md:text-3xl font-bold text-text-strong text-center">Find the Right Teacher for You</h1>
                {/* search bar */}
                <div data-aos="zoom-out" className="w-full md:w-[80%] lg:w-[60%] bg-bg-1 rounded-xl p-2 border border-border flex flex-col md:flex-row items-center gap-3 md:gap-5 shadow-sm">
                    {/* search input */}
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-weak h-4 w-4" />
                        <Input 
                            type="text"
                            placeholder="Search by name, subject, or keyword..."
                            className="w-full h-11 pl-10 border-none focus-visible:ring-0 bg-transparent"
                        />
                    </div>
                    {/* search button */}
                    <Button 
                        className="w-full md:w-auto h-11 px-8 cursor-pointer font-medium hover:scale-[1.02] transition-all duration-300 ease-in-out bg-primary hover:bg-primary/90"
                    >
                        Search
                    </Button>
                </div>
            </div>

            {/* body */}
            <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
                {/* mobile filter trigger */}
                <div className="lg:hidden flex justify-between items-center bg-bg-1 p-4 rounded-lg border border-border mb-4">
                    <p className="font-semibold text-text-strong">Filters</p>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                                <Filter className="h-4 w-4" />
                                <span>Filter</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                            <SheetHeader>
                                <SheetTitle>Filters</SheetTitle>
                            </SheetHeader>
                            <div className="py-6 overflow-y-auto h-full">
                                <TeacherFilterSection 
                                    subjects={subjects} 
                                    languages={languages} 
                                    isGettingFilters={isGettingFilters} 
                                />
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* desktop filters */}
                <aside className="hidden lg:block w-[280px] shrink-0">
                    <div data-aos="fade-right" className="sticky top-24 flex flex-col gap-6 p-6 bg-bg-1 border border-border rounded-xl shadow-sm">
                        <TeacherFilterSection 
                            subjects={subjects} 
                            languages={languages} 
                            isGettingFilters={isGettingFilters} 
                        />
                    </div>
                </aside>

                {/* right results */}
                <main className="flex-1 flex flex-col gap-6">
                    {/* sort by */}
                    <div data-aos="fade-left" className="flex flex-row justify-between items-center">
                        <div className="text-xl font-bold text-text-strong">
                            {isGettingTeachers ? <Skeleton className="h-6 w-32" /> : `${teachers.length} Teachers Found`}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-text-weak hidden sm:inline">Sort by:</span>
                            <NativeSelect className="h-9 w-[140px] text-sm">
                                <NativeSelectOption value="popular">Most Popular</NativeSelectOption>
                                <NativeSelectOption value="price-low">Price: Low to High</NativeSelectOption>
                                <NativeSelectOption value="price-high">Price: High to Low</NativeSelectOption>
                                <NativeSelectOption value="rating">Highest Rated</NativeSelectOption>
                            </NativeSelect>
                        </div>
                    </div>

                    {/* teacher results */}
                    <div className="grid grid-cols-1 gap-4">
                        {isGettingTeachers ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <TeacherCardSkeleton key={i} />
                            ))
                        ) : (
                            teachers.length > 0 ? (
                                teachers.map((teacher, i) => (
                                    <TeacherCard key={teacher.id || i} teacher={teacher} />
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-text-weak">
                                    <p className="text-lg">No teachers found matching your criteria.</p>
                                    <Button variant="link" className="text-primary">Clear all filters</Button>
                                </div>
                            )
                        )}
                    </div>
                </main>
            </div>

        </div>
    );
};

export default BrowseTeachers;