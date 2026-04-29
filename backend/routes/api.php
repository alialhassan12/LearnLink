<?php

use App\Http\Controllers\Api\authController;
use Illuminate\Support\Facades\Route;

Route::post('/register',[authController::class,'register'])->name('register_new_user');
Route::post('/login',[authController::class,'login'])->name('login_user');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout',[authController::class,'logout'])->name('logout_user');
});
