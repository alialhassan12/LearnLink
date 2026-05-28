import { Bolt, Eye, Info, Plus, Trash } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { NativeSelect, NativeSelectOption } from "../../components/ui/native-select";
import { useState } from "react";
import { Switch } from "../../components/ui/switch";
import { Button } from "../../components/ui/button";
import AddFeatureDialog, { type CustomFeature } from "../../components/adminDashboard/AddFeatureDialog";

const CreatePlan = () => {
    const [standardFeatures,setStandardFeatures]=useState<{
        label:string,
        name:string,
        type: 'number' | 'boolean' | 'string',
        value:any,
        limitedcheck?:boolean
    }[]>([
        {
            label:"Max Courses",
            name:"max_courses",
            type:"number",
            value:0,
            limitedcheck:false
        },
        {
            label:"Sessions per Month",
            name:"sessions_per_month",
            type:"number",
            value:0,
            limitedcheck:false
        },
        {
            label:"AI Tokens per Month",
            name:"ai_tokens_per_month",
            type:"number",
            value:0,
            limitedcheck:false
        },
        {
            label:"Search Priority",
            name:"search_priority",
            type:"boolean",
            value:false
        }
    ]);
    const [customFeatures,setCustomFeatures]=useState<CustomFeature[]>([]);

    const [addFeatureDialog,setAddFeatureDialog]=useState<boolean>(false);

    const handleDeleteCustomFeature = (name: string) => {
        setCustomFeatures(prev => prev.filter(f => f.name !== name));
    };


    return (
        <div className="flex flex-col gap-4">
            {/* header */}
            <div className="">
                <p className="text-text-strong text-3xl font-bold">Create New Plan</p>
                <p className="text-text-weak">Create and configure subscription plans for LearnLink users.</p>
            </div>
            {/* body */}
            <div className="flex flex-row flex-wrap gap-2">
                {/* left section */}
                <div className="flex flex-col w-full md:w-2/3 gap-2">
                    {/* basic plan info */}
                    <div className="flex flex-col p-4 bg-card border border-border rounded-lg">
                        <div className="flex flex-row items-center gap-2 mb-6">
                            <Info size={"22"} className="text-primary/70 font-bold"/>
                            <p className=" text-text-strong text-2xl font-semibold">Basic plan info</p>
                        </div>
                        {/* title */}
                        <div className="flex flex-col gap-2 mb-4">
                            <label className="uppercase text-text-weak text-sm">Plan Title</label>
                            <Input type="text" placeholder="Name your plan" className="h-10 text-text-strong" />
                        </div>
                        {/* description */}
                        <div className="flex flex-col gap-2 mb-4">
                            <label className="uppercase text-text-weak text-sm">Plan Description</label>
                            <Textarea  placeholder="Describe your plan" className="min-h-20 text-text-strong" />
                        </div>
                        {/* Plan Type */}
                        <div className="flex flex-col gap-2 mb-4">
                            <label className="uppercase text-text-weak text-sm">Plan Type</label>
                            <NativeSelect defaultValue={""} className="text-text-strong">
                                <NativeSelectOption className="bg-card text-text-strong text-sm" disabled value={""}>Select plan type</NativeSelectOption>
                                <NativeSelectOption className="bg-card text-text-strong text-sm" value="teacher">Teacher</NativeSelectOption>
                                <NativeSelectOption className="bg-card text-text-strong text-sm" value="student">Student</NativeSelectOption>
                            </NativeSelect>
                        </div>
                    </div>
                    {/* plan features */}
                    <div className="flex flex-col p-4 bg-card border border-border rounded-lg">
                        <div className="flex flex-row flex-wrap justify-between items-center">
                            <div className="flex flex-row items-center gap-2 mb-6">
                                <Bolt size={"22"} className="text-primary/70 font-bold"/>
                                <p className=" text-text-strong text-2xl font-semibold">Plan Features</p>
                            </div>
                            <Button 
                                variant="outline" 
                                className="flex items-center cursor-pointer"
                                onClick={() => setAddFeatureDialog(true)}
                            >
                                <Plus size={"20"}/>
                                <p>Add Feature</p>
                            </Button>
                        </div>
                        {/* features */}
                        <div className="flex flex-col gap-4">
                            {
                                standardFeatures.map((feature,index)=>{
                                    return (
                                        <div key={index} className="flex flex-col bg-bg-1/60 border border-border p-4 rounded-md">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">{feature.label}</span>
                                                {
                                                    feature.type==="number"&&(
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <Input 
                                                                type="number"
                                                                value={feature.value}
                                                                min={-1}
                                                                className="w-24 text-text-strong" 
                                                                disabled={feature.limitedcheck}
                                                                onChange={(e)=>setStandardFeatures(prev=>prev.map(f=>f.name===feature.name?{...f,value:e.target.value}:f))}
                                                            />
                                                            <div className="flex flex-row items-center gap-2">
                                                                <label className="text-text-weak text-sm">
                                                                    {feature.limitedcheck?"unlimited":"limited"}
                                                                </label>
                                                                <Switch
                                                                    checked={feature.limitedcheck}
                                                                    onCheckedChange={(checked)=>setStandardFeatures(prev=>prev.map(f=>f.name===feature.name?{...f,limitedcheck:checked,value:checked?-1:0}:f))}
                                                                    className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-zinc-500/40 cursor-pointer"
                                                                />
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                                {
                                                    feature.type==="string"&&(
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <Input 
                                                                type="text"
                                                                value={feature.value}
                                                                placeholder="Value"
                                                                className="text-text-strong" 
                                                                onChange={(e)=>setStandardFeatures(prev=>prev.map(f=>f.name===feature.name?{...f,value:e.target.value}:f))}
                                                            />
                                                        </div>
                                                    )
                                                }
                                                {
                                                    feature.type==="boolean" &&(
                                                        <div className="flex flex-row items-center gap-2">
                                                            <label className="text-text-weak text-sm">{feature.value?"Enabled":"Disabled"}</label>
                                                            <Switch 
                                                                checked={feature.value}
                                                                onCheckedChange={(checked)=>setStandardFeatures(prev=>prev.map(f=>f.name===feature.name?{...f,value:checked}:f))}
                                                                className="cursor-pointer"
                                                            />
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            <div className="flex flex-row items-center justify-between mt-4">
                                <span className="font-medium">Custom Features</span>
                            </div>
                            {
                                customFeatures.map((feature,index)=>{
                                    return (
                                        <div key={index} className="flex flex-col bg-bg-1/60 border border-border p-4 rounded-md">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">{feature.label}</span>
                                                {
                                                    feature.type==="number"&&(
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <Input 
                                                                type="number"
                                                                value={feature.value}
                                                                min={-1}
                                                                className="w-24 text-text-strong" 
                                                                disabled={feature.limitedcheck}
                                                                onChange={(e)=>setCustomFeatures(prev=>prev.map(f=>f.name===feature.name?{...f,value:e.target.value}:f))}
                                                            />
                                                            <div className="flex flex-row items-center gap-2">
                                                                <label className="text-text-weak text-sm">
                                                                    {feature.limitedcheck?"unlimited":"limited"}
                                                                </label>
                                                                <Switch
                                                                    checked={feature.limitedcheck}
                                                                    onCheckedChange={(checked)=>setCustomFeatures(prev=>prev.map(f=>f.name===feature.name?{...f,limitedcheck:checked,value:checked?-1:0}:f))}
                                                                    className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-zinc-500/40 cursor-pointer"
                                                                />
                                                                <Button
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    className="hover:text-red-500 hover:bg-red-500/10"
                                                                    onClick={() => handleDeleteCustomFeature(feature.name)}
                                                                >
                                                                    <Trash/>
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                                {
                                                    feature.type==="string"&&(
                                                        <div className="flex flex-row items-center gap-2">
                                                            <Input 
                                                                type="text"
                                                                value={feature.value}
                                                                placeholder="Value"
                                                                className="text-text-strong" 
                                                                onChange={(e)=>setCustomFeatures(prev=>prev.map(f=>f.name===feature.name?{...f,value:e.target.value}:f))}
                                                            />
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                className="hover:text-red-500 hover:bg-red-500/10"
                                                                onClick={() => handleDeleteCustomFeature(feature.name)}
                                                            >
                                                                <Trash/>
                                                            </Button>
                                                        </div>
                                                    )
                                                }
                                                {
                                                    feature.type==="boolean" &&(
                                                        <div className="flex flex-row items-center gap-2">
                                                            <label className="text-text-weak text-sm">{feature.value?"Enabled":"Disabled"}</label>
                                                            <Switch 
                                                                checked={feature.value}
                                                                onCheckedChange={(checked)=>setCustomFeatures(prev=>prev.map(f=>f.name===feature.name?{...f,value:checked}:f))}
                                                                className="cursor-pointer"
                                                            />
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                className="hover:text-red-500 hover:bg-red-500/10"
                                                                onClick={() => handleDeleteCustomFeature(feature.name)}
                                                            >
                                                                <Trash/>
                                                            </Button>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                {/* right section */}
                <div className="flex flex-col flex-1 gap-2 sticky top-15 h-fit">
                    {/* plan preview */}
                    <div className="flex flex-col p-4 bg-card border border-border rounded-lg"></div>
                    <div className="flex items-center justify-center gap-2 p-4 bg-card border border-border rounded-lg text-text-weak">
                        <Eye size={"20"}/>
                        <p className=" font-semibold">Live Preview updates as you type</p>
                    </div>
                </div>
            </div>
            <AddFeatureDialog open={addFeatureDialog} setOpen={setAddFeatureDialog} addFeature={setCustomFeatures} features={customFeatures} standardFeatures={standardFeatures}/>
        </div>
    );
};

export default CreatePlan;