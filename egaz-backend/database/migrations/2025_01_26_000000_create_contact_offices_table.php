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
        Schema::create('contact_offices', function (Blueprint $table) {
            $table->id();
            $table->string('title'); // e.g., "HEADQUARTER", "DAR ES SALAAM"
            $table->enum('office_type', ['headquarter', 'regional', 'research'])->default('regional');
            $table->string('office_name'); // e.g., "President's Office", "e-Government Authority"
            $table->text('location'); // e.g., "Mtumba-Mtandao Street"
            $table->text('postal_address'); // e.g., "PO Box 2833, 40404 DODOMA"
            $table->string('email'); // e.g., "barua@ega.go.tz"
            $table->string('phone'); // e.g., "+255 026 - 296 1957"
            $table->string('helpdesk')->nullable(); // e.g., "+255 764 292 299 / +255 0763 292 299"
            $table->text('map_embed_url')->nullable(); // Google Maps embed URL
            $table->decimal('map_latitude', 10, 8)->nullable(); // Latitude for map pin
            $table->decimal('map_longitude', 11, 8)->nullable(); // Longitude for map pin
            $table->decimal('map_rating', 2, 1)->nullable(); // e.g., 4.7
            $table->integer('map_reviews')->nullable(); // e.g., 3
            $table->integer('order')->default(0); // For ordering offices
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contact_offices');
    }
};
