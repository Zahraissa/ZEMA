<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
       Schema::create('menus', function (Blueprint $table) {
        $table->id();
        $table->string('name');   // e.g., Dashboard
        $table->string('url');    // e.g., /dashboard
        $table->string('icon')->nullable();
        $table->unsignedBigInteger('parent_id')->nullable(); // for sub-menus
        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menus');
    }
};
