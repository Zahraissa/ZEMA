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
        Schema::create('news_articles', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->text('excerpt');
            $table->longText('content');
            $table->string('author')->nullable();
            $table->string('category')->nullable();
            $table->text('tags')->nullable();
            $table->string('featured_image')->nullable();
            $table->date('publish_date');
            $table->enum('status', ['draft', 'published', 'scheduled'])->default('draft');
            $table->boolean('featured')->default(false);
            $table->boolean('allow_comments')->default(true);
            $table->integer('reading_time')->default(0);
            $table->string('slug')->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('news_articles');
    }
};
