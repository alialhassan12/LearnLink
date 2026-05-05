<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;

class SupabaseStorageService{
    
    protected $disk;
    
    public function __construct(){
        $this->disk=Storage::disk('s3');
    }

    public function uploadThumbnail(UploadedFile $file, string $course_title):string{
        $ext=$file->getClientOriginalExtension();
        $fileName=$course_title . '-'. time() . '.' . $ext;
        $path="course_thumbnails/courses/" . $fileName;

        $this->disk->put($path,file_get_contents($file));

        return $path;
    }

    public function uploadSectionMaterials(UploadedFile $file, string $courseTitle, string $sectionTitle,string $fileTitle):string{

        $ext=$file->getClientOriginalExtension();
        $fileName=strtolower($fileTitle) . '-' . time() . '.' . $ext;
        $path="course_materials/courses/" . strtolower($courseTitle) . "/" . strtolower($sectionTitle) . "/" . $fileName;

        $this->disk->put($path,file_get_contents($file));

        return $path;
    }
}