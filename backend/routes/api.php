<?php

use App\Http\Controllers\Api\authController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/register',[authController::class,'register'])->name('register_new_user');
Route::post('/auth/login',[authController::class,'login'])->name('login_user');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout',[authController::class,'logout'])->name('logout_user');
    Route::get('/auth/me',[authController::class,'checkAuth'])->name('check_auth');
});
