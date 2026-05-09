import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { NativeSelectOption,NativeSelect } from "../ui/native-select";
import { Skeleton } from "../ui/skeleton";

const FilterSection = ({ subjects, languages, isGettingFilters }: { subjects: string[], languages: string[], isGettingFilters: boolean }) => (
    <div className="flex flex-col gap-6">
        {/* filter header */}
        <div className="flex flex-row justify-between items-center border-b border-border pb-2">
            <p className="text-lg font-semibold text-text-strong">Filters</p>
            <Button
                variant="ghost"
                className="text-primary hover:text-primary/80 font-medium text-sm p-2 cursor-pointer"
            >
                Reset All
            </Button>
        </div>

        {/* subjects filter */}
        <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-text-strong uppercase tracking-wider">Subjects</p>
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                {isGettingFilters ? (
                    Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4 rounded" />
                            <Skeleton className="h-4 w-24 rounded" />
                        </div>
                    ))
                ) : (
                    subjects.map((subject, i) => (
                        <div key={i} className="flex flex-row items-center gap-2 group cursor-pointer">
                            <Checkbox
                                id={`filter-subject-${subject}`}
                                value={subject}
                                className="border-text-weak group-hover:border-primary"
                            />
                            <label 
                                htmlFor={`filter-subject-${subject}`} 
                                className="text-sm text-text-weak group-hover:text-text-strong cursor-pointer transition-colors"
                            >
                                {subject}
                            </label>
                        </div>
                    ))
                )}
            </div>
        </div>

        {/* languages filter */}
        <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-text-strong uppercase tracking-wider">Languages</p>
            <NativeSelect className="w-full text-sm h-10">
                {isGettingFilters ? (
                    <NativeSelectOption value="" disabled selected>Loading...</NativeSelectOption>
                ) : (
                    <>
                        <NativeSelectOption value="">All Languages</NativeSelectOption>
                        {languages.map((language, i) => (
                            <NativeSelectOption key={i} value={language}>
                                {language}
                            </NativeSelectOption>
                        ))}
                    </>
                )}
            </NativeSelect>
        </div>

        {/* hourly rate filter */}
        <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-text-strong uppercase tracking-wider">Hourly Rate</p>
            <div className="flex flex-row items-center gap-3">
                <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-weak text-xs">$</span>
                    <Input 
                        type="number"
                        placeholder="Min"
                        className="w-full h-10 pl-7 text-sm"
                    />
                </div>
                <span className="text-text-weak">-</span>
                <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-weak text-xs">$</span>
                    <Input 
                        type="number"
                        placeholder="Max"
                        className="w-full h-10 pl-7 text-sm"
                    />
                </div>
            </div>
        </div>
    </div>
);

export default FilterSection;
