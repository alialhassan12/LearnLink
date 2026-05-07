<?php

namespace App\Services;

use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;

class SupabaseStorageService{
    
    protected FilesystemAdapter $disk;
    
    public function __construct(){
        $this->disk=Storage::disk('s3');
    }

    public function uploadAvatar(UploadedFile $file,int $user_id,?string $oldPath):string{
        if($oldPath){
            $this->disk->delete($oldPath);
        }

        $ext=$file->getClientOriginalExtension();
        $fileName=strval($user_id) . '-' . time() . '.' . $ext;
        $path="avatars/users/" . $fileName;
        
        $this->disk->put(
            $path,
            fopen($file->getRealPath(), 'r'),
            ['ContentType' => $file->getMimeType()]
        );
        return $path;
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

    public function getPublicUrl(string $path):string{
        if (!$path) return "";
        
        // If it's already a full URL, return it
        if (filter_var($path, FILTER_VALIDATE_URL)) {
            return $path;
        }

        $endpoint = config('filesystems.disks.s3.endpoint');
        $bucket = config('filesystems.disks.s3.bucket');
        
        // Extract project ID from endpoint: https://[id].storage.supabase.co/storage/v1/s3
        // Base URL: https://[id].supabase.co
        $baseUrl = str_replace('.storage.supabase.co/storage/v1/s3', '.supabase.co', $endpoint);
        
        return "{$baseUrl}/storage/v1/object/public/{$bucket}/" . ltrim($path, '/');
    }
    
}