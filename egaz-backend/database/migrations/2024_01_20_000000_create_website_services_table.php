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
        Schema::create('website_services', function (Blueprint $table) {
            $table->id();
            $table->string('front_icon')->nullable();
            $table->string('front_title');
            $table->text('front_description');
            $table->string('back_title');
            $table->text('back_description');
            $table->string('back_image')->nullable();
            $table->string('link')->nullable();
            $table->integer('order')->default(0);
            $table->enum('status', ['active', 'inactive', 'draft'])->default('active');
            $table->boolean('is_active')->default(true);
            $table->boolean('featured')->default(false);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Foreign keys
            $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
            $table->foreign('updated_by')->references('id')->on('users')->onDelete('set null');

            // Indexes
            $table->index(['status', 'is_active']);
            $table->index('featured');
            $table->index('order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('website_services');
    }
};
