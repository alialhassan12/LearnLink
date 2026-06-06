<?php

namespace App\Services;
use Illuminate\Support\Facades\Http;

class AiService
{
    private string $aiApiKey;
    private string $geminiUrl="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=";
    private string $ollamaModel;
    private string $ollamaUrl="http://127.0.0.1:11434/api/generate";

    public function __construct()
    {
        $this->aiApiKey = config("services.gemini.api_key");
        $this->ollamaModel=config("services.ollama.model");
    }

    public function generate(string $prompt){
        // Gemini flash 2.5

        // $response=Http::connectTimeout(120)
        //         ->timeout(120)
        //         ->post($this->geminiUrl.$this->aiApiKey,[
        //             "contents"=>[
        //                 "parts"=>[
        //                     "text"=>$prompt
        //                 ]
        //             ]
        //         ]);


        // ollama
        $response=Http::connectTimeout(120)
                ->timeout(120)
                ->post($this->ollamaUrl,[
                    'model'=>$this->ollamaModel,
                    'prompt'=>$prompt,
                    'stream'=>false
                ]);

        // check if response status is ok
        if($response->status() != 200){
            return null;
        }

        return $response->json();
    }
}