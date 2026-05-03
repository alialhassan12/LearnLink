import { ChevronRight, Image, NotebookPen, NotebookText, Upload, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useEffect, useRef, useState } from "react";
import { Progress } from "../../components/ui/progress";
import { Field, FieldGroup, FieldLabel } from "../../components/ui/field";
import { Input } from "../../components/ui/input";
import useCategoryStore from "../../store/categoryStore";
import { Textarea } from "../../components/ui/textarea";

const CreateCourse=()=>{
    const {categories,getCategories}=useCategoryStore();
    const [stepProgress,setStepProgress]=useState<number>(10);
    const [courseData,setCourseData]=useState<{
        title:string,
        teacher_id:number,
        category_id:number,
        language:string,
        description:string,
        thumbnail:string,
        price:number
    }>({title:"",teacher_id:0,category_id:0,language:"",description:"",thumbnail:"",price:0});

    useEffect(()=>{
        getCategories();
    },[]);

    const [imageFile,setImageFile]=useState<File | null>(null);
    const [imagePreview,setImagePreview]=useState<string>("");
    const fileInputRef=useRef<HTMLInputElement>(null);
    // trigger file input
    const triggerFileInput=()=>{
        fileInputRef.current?.click();
    };

    // handle remove image
    const handleRemoveImage=()=>{
        setImageFile(null);
        setImagePreview("");
        if(fileInputRef.current){
            fileInputRef.current.value="";
        }
    };
    
    // handle file upload
    const handleFileChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const file=e.target.files?.[0];
        if(file){
            setImageFile(file);
            const reader=new FileReader();
            reader.onloadend=()=>{
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }
    // handle drag and drop
    const handleDragOver=(e:React.DragEvent<HTMLDivElement>)=>{
        e.preventDefault();
    }
    const handleDrop=(e:React.DragEvent<HTMLDivElement>)=>{
        e.preventDefault();
        const file=e.dataTransfer.files[0];
        if(file){
            setImageFile(file);
            const reader=new FileReader();
            reader.onloadend=()=>{
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }

    return(
        <div>
            {/* top section */}
            <div className="flex flex-row justify-between items-center">
                <div className="flex flex-col ">
                    <p className="text-sm text-primary tracking-widest">COURSE BUILDER</p>
                    <p className="text-4xl font-bold text-text-strong">Create New Course</p>
                </div>
                <div>
                    <Button variant="outline" className="px-4 h-10 cursor-pointer border-primary">
                        Save Draft
                    </Button>
                </div>
            </div>

            {/* body section */}
            <div className="">
                {/* progress bar of the steps */}
                <div className="lg:w-1/2 mt-4 mx-auto sm:w-full sticky top-15 z-10 bg-bg-1/50 backdrop-blur-xl rounded-xl p-4">
                    <Progress value={stepProgress} />
                    <div className="flex justify-between mt-2">
                        <div className="flex flex-col items-center translate-y-[-50%] gap-1">
                            <span className={`w-7 h-7 flex items-center justify-center rounded-full font-bold text-sm ${stepProgress >= 10 ? "bg-primary text-white" : "bg-border"} transition-colors duration-200 ease-in-out`}>
                                1
                            </span>
                            <p className={`text-xs font-medium ${stepProgress >= 10 ? "text-primary" : "text-text-weak"} transition-colors duration-200 ease-in-out`}>Basic Info</p>
                        </div>
                        <div className="flex flex-col items-center translate-y-[-50%] gap-1">
                            <span className={`w-7 h-7 flex items-center justify-center rounded-full font-bold text-sm ${stepProgress >= 50 ? "bg-primary text-white" : "bg-border"} transition-colors duration-200 ease-in-out`}>
                                2
                            </span>
                            <p className={`text-xs font-medium ${stepProgress >= 50 ? "text-primary" : "text-text-weak"} transition-colors duration-200 ease-in-out`}>Course Content</p>
                        </div>
                        <div className="flex flex-col items-center translate-y-[-50%] gap-1">
                            <span className={`w-7 h-7 flex items-center justify-center rounded-full font-bold text-sm ${stepProgress >= 100 ? "bg-primary text-white" : "bg-border"} `}>
                                3
                            </span>
                            <p className={`text-xs font-medium ${stepProgress >= 100 ? "text-primary" : "text-text-weak"}`}>Publish Course</p>
                        </div>
                    </div>
                </div>

                {/* content of steps */}
                {/* step1: basic info of course */}
                {
                    stepProgress===10 && (
                        <div className="flex flex-row gap-4 w-full mb-10 flex-wrap">
                            {/* left general info */}
                            <div className="flex flex-col justify-start items-start w-[50%] gap-4">
                                {/* general info form */}
                                <div className="flex flex-col gap-4 bg-card p-6 rounded-lg w-[100%]">
                                    {/* title */}
                                    <div className="flex flex-row items-center gap-2">
                                        <NotebookPen/>
                                        <p className="text-text-strong font-semibold text-2xl">General Info</p>
                                    </div>
                                    {/* form */}
                                    <FieldGroup>
                                        <Field>
                                            <FieldLabel className="text-sm font-semibold text-text-weak">
                                                Course Title
                                            </FieldLabel>
                                            <Input 
                                                className="border-border" 
                                                placeholder="Enter your course title" 
                                                type="text"
                                                value={courseData.title}
                                                onChange={(e)=>setCourseData({...courseData,title:e.target.value})}
                                            />
                                        </Field>
                                        {/* category select */}
                                        <Field>
                                            <FieldLabel className="text-sm font-semibold text-text-weak">
                                                Category
                                            </FieldLabel>
                                            <select
                                                value={courseData.category_id}
                                                onChange={(e)=>setCourseData({...courseData,category_id:Number(e.target.value)})}
                                                className="border border-border rounded-lg p-2 w-full h-10 cursor-pointer outline-none"
                                            >
                                                <option className="bg-card" disabled selected>Select Category</option>
                                                {categories.map((category)=>{
                                                    return(
                                                        <option className="bg-card" key={category.id} value={category.id}>{category.title}</option>
                                                    );
                                                })}
                                            </select>
                                        </Field>
                                        {/* language select */}
                                        <Field>
                                            <FieldLabel className="text-sm font-semibold text-text-weak">
                                                Language
                                            </FieldLabel>
                                            <select
                                                value={courseData.language}
                                                onChange={(e)=>setCourseData({...courseData,language:e.target.value})}
                                                className="border border-border rounded-lg p-2 w-full h-10 cursor-pointer outline-none"
                                                >
                                                <option className="bg-card" value="" disabled selected>Select Language</option>
                                                <option className="bg-card" value="English">English</option>
                                                <option className="bg-card" value="Arabic">Arabic</option>
                                            </select>
                                        </Field>
                                    </FieldGroup>
                                </div>
                                {/* description */}
                                <div className="flex flex-col gap-4 bg-card p-6 rounded-lg w-[100%]">
                                    {/* title */}
                                    <div className="flex flex-row items-center gap-2">
                                        <NotebookText/>
                                        <p className="text-text-strong font-semibold text-2xl">Course Description</p>
                                    </div>
                                    {/* description input */}
                                    <Field>
                                        <Textarea 
                                            value={courseData.description}
                                            onChange={(e)=>setCourseData({...courseData,description:e.target.value})}
                                            placeholder="Tell students what they will learn and why they should take this course..."
                                        />
                                    </Field>
                                </div>
                            </div>
                            {/* right thumbnail */}
                            <div className="flex flex-col gap-4 bg-card p-6 rounded-lg w-[40%] h-fit">
                                {imagePreview
                                    ?(
                                        <>
                                            <img src={imagePreview} className="w-full h-full object-cover rounded-lg" />
                                            <Button variant={"destructive"} onClick={handleRemoveImage} className="w-full h-10 cursor-pointer">Remove Image</Button>
                                        </>
                                    )
                                    :(
                                        <>
                                            {/* title */}
                                            <div className="flex flex-row items-center gap-2">
                                                <Image/>
                                                <p className="text-text-strong font-semibold text-2xl">Course Thumbnail</p>
                                            </div>
                                            {/* thumbnail input */}
                                            <div
                                                onClick={triggerFileInput} 
                                                onDragOver={handleDragOver}
                                                onDrop={handleDrop}
                                                className="border border-dashed w-full h-40 rounded-lg flex flex-col justify-center items-center p-3 cursor-pointer hover:bg-bg-1 transition-all duration-300 ease-in-out"
                                            >
                                                <div className="bg-bg-1 p-4 rounded-full text-text-strong mb-3">
                                                    <Upload size={20}/>
                                                </div>
                                                <p className="text-text-weak text-lg">
                                                    {imageFile? imageFile.name : "Upload Course Thumbnail"}
                                                </p>
                                                <p className="text-text-weak text-xs text-center">Drag and Drop, or click here to upload. Use .JPG, .JPEG, or .PNG Max 5MB.</p>
                                            </div>
                                            <Input 
                                                className="hidden" 
                                                ref={fileInputRef} 
                                                type="file" 
                                                accept=".jpg,.jpeg,.png" 
                                                onChange={handleFileChange}
                                            />
                                        </>
                                    )
                                }
                                
                            </div>
                        </div>
                    )
                }

                {/* step2: course content */}
                {
                    stepProgress===50 && (
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-semibold">Course Content</h1>
                            </div>
                        </div>
                    )
                }

                {/* step3: publish course */}
                {
                    stepProgress===100 && (
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-semibold">Publish Course</h1>
                            </div>
                        </div>
                    )
                }
            </div>

            {/* bottom section */}
            <div className="flex justify-between items-center border-t border-border py-4 sticky bottom-0 z-50 bg-bg-1/50 backdrop-blur-xl">
                <Button className="px-4 h-10 cursor-pointer" variant="outline">
                    <X/>
                    Discard
                </Button>
                <Button className="px-4 h-10 cursor-pointer bg-primary hover:bg-primary/80">
                    Next
                    <ChevronRight/>
                </Button>
            </div>
        </div>
    );
};  
export default CreateCourse;