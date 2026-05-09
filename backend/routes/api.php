<?php

use App\Http\Controllers\Api\authController;
use App\Http\Controllers\Api\categoriesController;
use App\Http\Controllers\Api\coursesController;
use App\Http\Controllers\Api\teacherController;
use Illuminate\Support\Facades\Route;

// public routes
Route::post('/auth/register',[authController::class,'register'])->name('register_new_user');
Route::post('/auth/login',[authController::class,'login'])->name('login_user');

// auth routes
Route::middleware('auth:sanctum')->group(function () {
    // common routes between roles
    Route::post('/auth/logout',[authController::class,'logout'])->name('logout_user');
    Route::get('/auth/me',[authController::class,'checkAuth'])->name('check_auth');
    Route::get('/categories',[categoriesController::class,'getCategories'])->name('get_categories');

    // teacher routes
    Route::middleware(['checkRole:teacher'])->group(function(){
        Route::get('/teacher/profile',[teacherController::class,'teacherProfile'])->name('teacher_profile');
        Route::put('/teacher/update-profile',[teacherController::class,'teacherUpdate'])->name('teacher_update');
        Route::post('/courses/create-course',[coursesController::class,'createCourse'])->name('create_course');
        Route::get('/courses/my-courses',[coursesController::class,'getTeacherCourses'])->name('get_teacher_courses');
    });

    // student routes
    Route::middleware(['checkRole:student'])->group(function(){
        Route::get('/teachers',[teacherController::class,'getTeachers'])->name('get_teachers');
        Route::get('/teachers/subjects',[teacherController::class,'getSubjects'])->name('get_subjects');
        Route::get('/teachers/languages',[teacherController::class,'getLanguages'])->name('get_languages');
        Route::get('/teacher/{id}',[teacherController::class,'getTeacherById'])->name('get_teacher_by_id');
    });
});
