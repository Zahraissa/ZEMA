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
        Schema::create('guidelines', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->longText('content')->nullable();
            $table->string('category');
            $table->string('document_type');
            $table->string('version');
            $table->date('date_published');
            $table->date('last_updated')->nullable();
            $table->enum('status', ['active', 'draft', 'archived'])->default('draft');
            $table->string('file_path')->nullable();
            $table->string('file_name')->nullable();
            $table->bigInteger('file_size')->nullable();
            $table->string('file_type')->nullable();
            $table->string('file_url')->nullable();
            $table->json('tags')->nullable();
            $table->string('author')->nullable();
            $table->string('department')->nullable();
            $table->boolean('is_main_document')->default(false);
            $table->boolean('featured')->default(false);
            $table->integer('view_count')->default(0);
            $table->integer('download_count')->default(0);
            $table->integer('order')->default(0);
            $table->json('related_documents')->nullable();
            $table->timestamps();

            // Indexes
            $table->index(['status', 'is_main_document']);
            $table->index(['category', 'status']);
            $table->index(['document_type', 'status']);
            $table->index(['featured', 'status']);
            $table->index('order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guidelines');
    }
};
