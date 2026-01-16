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
        Schema::table('news_articles', function (Blueprint $table) {
            // Drop columns that are no longer needed
            $table->dropColumn([
                'subtitle',
                'excerpt', 
                'content',
                'tags',
                'featured_image',
                'featured',
                'allow_comments',
                'reading_time',
                'slug'
            ]);
            
            // Add new simplified columns
            $table->text('description')->after('title');
            $table->string('image')->nullable()->after('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('news_articles', function (Blueprint $table) {
            // Recreate the original columns
            $table->string('subtitle')->nullable()->after('title');
            $table->text('excerpt')->after('subtitle');
            $table->longText('content')->after('excerpt');
            $table->text('tags')->nullable()->after('category');
            $table->string('featured_image')->nullable()->after('tags');
            $table->boolean('featured')->default(false)->after('status');
            $table->boolean('allow_comments')->default(true)->after('featured');
            $table->integer('reading_time')->default(0)->after('allow_comments');
            $table->string('slug')->unique()->after('reading_time');
            
            // Drop the new simplified columns
            $table->dropColumn(['description', 'image']);
        });
    }
};
