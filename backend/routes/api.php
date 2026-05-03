<?php

use App\Http\Controllers\Api\authController;
use App\Http\Controllers\Api\categoriesController;
use App\Http\Controllers\Api\coursesController;
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
    Route::middleware('checkRole:teacher')->group(function(){
        Route::post('/courses/create-course',[coursesController::class,'createCourse'])->name('create_course');
    });
});
