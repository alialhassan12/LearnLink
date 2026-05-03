<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class categoriesController extends Controller
{
    public function getCategories(Request $request){
        $categories=Category::all();
        return response()->json([
            "success"=>true,
            "message"=>"Categories retrieved successfully",
            "categories"=>$categories,
        ],200);
    }
}
