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
        Schema::create('guideline_standards', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->longText('content')->nullable();
            $table->foreignId('group_id')->constrained('guidelines_groups')->onDelete('cascade');
            $table->string('standard_type');
            $table->string('maturity_level');
            $table->string('version');
            $table->enum('status', ['active', 'inactive', 'draft'])->default('active');
            $table->string('author')->nullable();
            $table->string('department')->nullable();
            $table->date('date_published');
            $table->json('tags')->nullable();
            $table->boolean('featured')->default(false);
            $table->integer('order')->default(1);
            $table->string('file_path')->nullable();
            $table->string('file_name')->nullable();
            $table->bigInteger('file_size')->nullable();
            $table->string('file_type')->nullable();
            $table->string('file_url')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guideline_standards');
    }
};
