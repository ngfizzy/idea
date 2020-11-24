<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;

class PasswordResetMail extends Mailable
{
    public $resetUrl;
    
    public function __construct($token)
    {
         $this->resetUrl = env('PASSWORD_RESET_BASE_URL')."/$token";
    }
  /**
   * rese
   */
    public function build()
    {
        return $this->view('reset-password', ['resetUrl' => $this->resetUrl]);
    }
}
