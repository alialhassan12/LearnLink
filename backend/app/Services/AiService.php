<?php

namespace App\Services;
use Illuminate\Support\Facades\Http;

class AiService
{
    private string $aiApiKey;
    private string $basUrl="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=";

    public function __construct()
    {
        $this->aiApiKey = config("services.gemini.api_key");
    }

    public function generate(string $prompt){
        $response=Http::connectTimeout(120)
                ->timeout(120)
                ->post($this->basUrl.$this->aiApiKey,[
                    "contents"=>[
                        "parts"=>[
                            "text"=>$prompt
                        ]
                    ]
                ]);
        return $response->json();
    }
}