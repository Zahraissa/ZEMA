<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SliderController;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\BandMemberController;
use App\Http\Controllers\Api\AboutController;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\GuideController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\WelcomeMessageController;
use App\Http\Controllers\Api\BrandController;
use App\Http\Controllers\Api\FAQController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\WebsiteServiceController;
use App\Http\Controllers\Api\DirectorGeneralController;
use App\Http\Controllers\Api\AuthorityFunctionController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\MuhimuController;
use App\Http\Controllers\Api\AnnouncementController;
use App\Http\Controllers\Api\VideoController;
use App\Http\Controllers\Api\DownloadController;
use App\Http\Controllers\Api\GuidelinesController;
use App\Http\Controllers\Api\GuidelinesGroupController;
use App\Http\Controllers\Api\GuidelineStandardController;
use App\Http\Controllers\Api\SampleTemplateController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\PermissionController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Public content routes (for website frontend)
Route::get('/sliders/active', [SliderController::class, 'active']);
Route::get('/news/published', [NewsController::class, 'published']);
Route::get('/news/featured', [NewsController::class, 'featured']);
Route::get('/news/categories', [NewsController::class, 'categories']);
Route::get('/services/active', [ServiceController::class, 'active']);
Route::get('/services/featured', [ServiceController::class, 'featured']);
Route::get('/services/categories', [ServiceController::class, 'categories']);
Route::get('/band-members/active', [BandMemberController::class, 'active']);
Route::get('/about/active', [AboutController::class, 'active']);
Route::get('/about/sections', [AboutController::class, 'sections']);
Route::get('/about/section/{section}', [AboutController::class, 'bySection']);
Route::get('/director-general/active', [DirectorGeneralController::class, 'active']);
Route::get('/authority-functions/active', [AuthorityFunctionController::class, 'active']);
Route::get('/menu/structure', [MenuController::class, 'structure']);
Route::get('/brands/active', [BrandController::class, 'active']);
// Role and Permission Management (public for now, should be protected)
Route::get('/roles', [RoleController::class, 'index']);
// Permission routes moved to protected section below
Route::get('/pictures/{folder}/{filename}', function ($folder, $filename) {
    $path = storage_path("app/public/{$folder}/{$filename}");

    if (!file_exists($path) || !is_file($path)) {
        abort(404, 'File not found');
    }

    // Get file mime type
    $mimeType = mime_content_type($path);
    if (!$mimeType) {
        // Fallback to application/pdf for PDF files
        $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        $mimeType = $extension === 'pdf' ? 'application/pdf' : 'application/octet-stream';
    }

    // Clear any output buffering to prevent corruption
    if (ob_get_level()) {
        ob_end_clean();
    }

    // Read file contents as binary
    $fileContents = file_get_contents($path);
    $fileSize = filesize($path);

    // Return file with proper headers and binary-safe response
    return response($fileContents, 200)
        ->header('Content-Type', $mimeType)
        ->header('Content-Disposition', 'inline; filename="' . basename($filename) . '"')
        ->header('Content-Length', $fileSize)
        ->header('Cache-Control', 'public, max-age=31536000')
        ->header('Accept-Ranges', 'bytes')
        ->header('Content-Transfer-Encoding', 'binary');
});

// Contact routes (public)
Route::get('/contact/offices/active', [ContactController::class, 'active']);
Route::get('/contact/offices/all', [ContactController::class, 'allOffices']);
Route::get('/contact/offices/headquarters', [ContactController::class, 'headquarters']);
Route::get('/contact/offices/regional', [ContactController::class, 'regional']);
Route::get('/contact/offices/research', [ContactController::class, 'research']);
Route::get('/contact/offices/type/{type}', [ContactController::class, 'byType']);

// Contact office management (temporarily public for testing)
Route::get('/contact/offices', [ContactController::class, 'index']);
Route::post('/contact/offices', [ContactController::class, 'store']);
Route::get('/contact/offices/{contact}', [ContactController::class, 'show']);
Route::put('/contact/offices/{contact}', [ContactController::class, 'update']);
Route::post('/contact/offices/{contact}', [ContactController::class, 'update']); // For method override
Route::delete('/contact/offices/{contact}', [ContactController::class, 'destroy']);
Route::patch('/contact/offices/{contact}/toggle-status', [ContactController::class, 'toggleStatus']);

// FAQ routes (public)
Route::get('/faqs/active', [FAQController::class, 'active']);
Route::get('/faqs/search', [FAQController::class, 'search']);
Route::get('/faqs/categories', [FAQController::class, 'categories']);
Route::get('/faqs/category/{category}', [FAQController::class, 'byCategory']);

// Temporary: Make FAQs management public for testing
Route::get('/faqs', [FAQController::class, 'index']);

// Guide routes (public)
Route::get('/guides/active', [GuideController::class, 'active']);
Route::get('/guides/featured', [GuideController::class, 'featured']);
Route::get('/guides/categories', [GuideController::class, 'categories']);
Route::get('/guides/category/{category}', [GuideController::class, 'byCategory']);
Route::get('/guides/{id}', [GuideController::class, 'show']);
Route::get('/guides/{id}/download', [GuideController::class, 'download']);

// Guidelines routes (public) - Miogozo ya Kisera
Route::get('/guidelines', [GuidelinesController::class, 'index']);
Route::get('/guidelines/main-document', [GuidelinesController::class, 'mainDocument']);
Route::get('/guidelines/related-documents', [GuidelinesController::class, 'relatedDocuments']);
Route::get('/guidelines/main-documents', [GuidelinesController::class, 'getMainDocuments']);
Route::get('/guidelines/related-documents', [GuidelinesController::class, 'getRelatedDocuments']);
Route::get('/guidelines/categories', [GuidelinesController::class, 'categories']);
Route::get('/guidelines/document-types', [GuidelinesController::class, 'documentTypes']);
Route::get('/guidelines/category/{category}', [GuidelinesController::class, 'byCategory']);
Route::get('/guidelines/type/{documentType}', [GuidelinesController::class, 'byDocumentType']);
Route::get('/guidelines/search', [GuidelinesController::class, 'search']);
Route::get('/guidelines/{id}', [GuidelinesController::class, 'show']);
Route::get('/guidelines/{id}/download', [GuidelinesController::class, 'download']);
Route::post('/guidelines/{id}/increment-view', [GuidelinesController::class, 'incrementView']);
Route::post('/guidelines/{id}/increment-download', [GuidelinesController::class, 'incrementDownload']);

// Guidelines Standards routes (public) - Viwango na Miongo
Route::get('/guidelines-standards/active', [GuidelineStandardController::class, 'index']);
Route::get('/guidelines-standards/search', [GuidelineStandardController::class, 'search']);
Route::get('/guidelines-standards/{id}/download', [GuidelineStandardController::class, 'download']);
Route::get('/guidelines-standards/{id}', [GuidelineStandardController::class, 'show']);

// Guidelines Groups routes (public) - Viwango na Miongo Categories
Route::get('/guidelines-groups/active', [GuidelinesGroupController::class, 'index']);
Route::get('/guidelines-groups/with-standards', [GuidelinesGroupController::class, 'withStandards']);

// Gallery routes (public)
Route::get('/gallery/active', [GalleryController::class, 'active']);
Route::get('/gallery/featured', [GalleryController::class, 'featured']);
Route::get('/gallery/categories', [GalleryController::class, 'categories']);
Route::get('/gallery/category/{category}', [GalleryController::class, 'byCategory']);

// Website Services routes (public)
Route::get('/website-services/active', [WebsiteServiceController::class, 'getActiveServices']);

// Muhimu Section routes (public)
Route::get('/muhimu', [MuhimuController::class, 'index']);
Route::post('/muhimu/downloads/{id}/increment', [MuhimuController::class, 'incrementDownload']);



// Welcome messages (public)
Route::get('/welcome-messages/active', [WelcomeMessageController::class, 'getActive']);

    // All management routes are now properly protected below in the auth:sanctum middleware group

    // Protected routes (require authentication)
    Route::middleware('auth:sanctum')->group(function () {
        // Auth routes
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);

        Route::apiResource('news', NewsController::class);
        Route::post('/news/{news}', [NewsController::class, 'update']); 
        Route::get('/news', [NewsController::class, 'index']);
        Route::delete('/news/{articles}', [NewsController::class, 'destroy']);
        Route::middleware('auth:sanctum')->delete('/news/{articles}', [NewsController::class, 'destroy']);

        // Slider management
        Route::get('/sliders', [SliderController::class, 'index']);
        Route::post('/sliders', [SliderController::class, 'store']);
        Route::get('/sliders/{slider}', [SliderController::class, 'show']);
        Route::put('/sliders/{slider}', [SliderController::class, 'update']);
        Route::patch('/sliders/{slider}', [SliderController::class, 'update']);
        Route::post('/sliders/{slider}', [SliderController::class, 'update']); // For file uploads with method override
        Route::delete('/sliders/{slider}', [SliderController::class, 'destroy']);
        Route::post('/sliders/reorder', [SliderController::class, 'reorder']);

        // Brand management
        Route::get('/brands', [BrandController::class, 'index']);
        Route::post('/brands', [BrandController::class, 'store']);
        Route::get('/brands/{brand}', [BrandController::class, 'show']);
        Route::put('/brands/{brand}', [BrandController::class, 'update']);
        Route::patch('/brands/{brand}', [BrandController::class, 'update']);
        Route::post('/brands/{brand}', [BrandController::class, 'update']); // For file uploads with method override
        Route::delete('/brands/{brand}', [BrandController::class, 'destroy']);
        Route::post('/brands/reorder', [BrandController::class, 'reorder']);

    // News management
    /* Route::apiResource('news', NewsController::class);
    Route::post('/news/{news}', [NewsController::class, 'update'Route::apiResource('news', NewsController::class)]); // For file uploads with method override
    Route::get('/news', [NewsController::class, 'index']); */

    // Service management
    Route::apiResource('services', ServiceController::class);
    Route::post('/services/{service}', [ServiceController::class, 'update']); // For file uploads with method override
    Route::get('/services', [ServiceController::class, 'index']);

    // Band member management
    Route::apiResource('band-members', BandMemberController::class);
    Route::post('/band-members/reorder', [BandMemberController::class, 'reorder']);

    // About content management
    Route::apiResource('about', AboutController::class);
    Route::get('/about', [AboutController::class, 'index']);

    // Director General management
    Route::apiResource('director-general', DirectorGeneralController::class);
    Route::post('/director-general/reorder', [DirectorGeneralController::class, 'reorder']);

    // Authority Functions management
    Route::apiResource('authority-functions', AuthorityFunctionController::class);
    Route::post('/authority-functions/reorder', [AuthorityFunctionController::class, 'reorder']);
    Route::patch('/authority-functions/{authority_function}/toggle-status', [AuthorityFunctionController::class, 'toggleStatus']);

    // Menu management
    Route::prefix('menu')->group(function () {
        // Test endpoint
        Route::get('/test', [MenuController::class, 'test']);

        // Menu types
        Route::get('/types', [MenuController::class, 'types']);
        Route::get('/types/{type}', [MenuController::class, 'getType']);
        Route::post('/types', [MenuController::class, 'storeType']);
        Route::put('/types/{type}', [MenuController::class, 'updateType']);
        Route::delete('/types/{type}', [MenuController::class, 'destroyType']);

        // Menu groups
        Route::get('/groups', [MenuController::class, 'groups']);
        Route::post('/groups', [MenuController::class, 'storeGroup']);
        Route::put('/groups/{group}', [MenuController::class, 'updateGroup']);
        Route::delete('/groups/{group}', [MenuController::class, 'destroyGroup']);

        // Menu items
        Route::get('/items', [MenuController::class, 'items']);
        Route::post('/items', [MenuController::class, 'storeItem']);
        Route::put('/items/{item}', [MenuController::class, 'updateItem']);
        Route::delete('/items/{item}', [MenuController::class, 'destroyItem']);

        // Reorder endpoints
        Route::post('/groups/reorder', [MenuController::class, 'reorderGroups']);
        Route::post('/items/reorder', [MenuController::class, 'reorderItems']);
    });

    // Guide management
    Route::get('/guides', [GuideController::class, 'index']);
    Route::post('/guides', [GuideController::class, 'store']);
    Route::get('/guides/{id}', [GuideController::class, 'showGuide']);
    Route::put('/guides/{id}', [GuideController::class, 'update']);
    Route::delete('/guides/{id}', [GuideController::class, 'destroy']);
    Route::post('/guides/reorder', [GuideController::class, 'reorder']);
    Route::patch('/guides/{id}/featured', [GuideController::class, 'toggleFeatured']);
    Route::patch('/guides/{id}/status', [GuideController::class, 'updateStatus']);

    // Guidelines management (protected) - Miogozo ya Kisera
    Route::get('/guidelines-management', [GuidelinesController::class, 'managementIndex']);
    Route::post('/guidelines', [GuidelinesController::class, 'store']);
    Route::get('/guidelines/{id}/edit', [GuidelinesController::class, 'showGuideline']);
    Route::put('/guidelines/{id}', [GuidelinesController::class, 'update']);
    Route::delete('/guidelines/{id}', [GuidelinesController::class, 'destroy']);
    Route::post('/guidelines/reorder', [GuidelinesController::class, 'reorder']);
    Route::patch('/guidelines/{id}/featured', [GuidelinesController::class, 'toggleFeatured']);
    Route::patch('/guidelines/{id}/main-document', [GuidelinesController::class, 'toggleMainDocument']);
    Route::patch('/guidelines/{id}/status', [GuidelinesController::class, 'updateStatus']);
    Route::get('/guidelines-statistics', [GuidelinesController::class, 'statistics']);

    // Guidelines Groups management (protected)
    Route::apiResource('guidelines-groups', GuidelinesGroupController::class);

    // Guidelines Standards management (protected)
    Route::apiResource('guidelines-standards', GuidelineStandardController::class);

    // Sample Templates management (protected)
    Route::apiResource('samples-templates', SampleTemplateController::class);

    // Role management
    Route::apiResource('roles', RoleController::class);
    Route::get('/roles/{role}/permissions', [RoleController::class, 'permissions']);
    Route::get('/roles/permissions/grouped', [RoleController::class, 'permissionsGrouped']);

    // Permission management
    // IMPORTANT: Specific routes must come BEFORE apiResource to avoid route model binding conflicts
    Route::get('/permissions/grouped', [PermissionController::class, 'grouped']);
    Route::get('/permissions/groups', [PermissionController::class, 'groups']);
    Route::apiResource('permissions', PermissionController::class);

    // User management
    Route::apiResource('users', UserController::class);
    Route::patch('/users/{user}/status', [UserController::class, 'updateStatus']);
    Route::get('/users/{user}/roles', [UserController::class, 'roles']);
    Route::post('/users/{user}/assign-roles', [UserController::class, 'assignRoles']);
    Route::get('/users/{user}/permissions', [UserController::class, 'permissions']);
    Route::post('/users/{user}/check-permission', [UserController::class, 'hasPermission']);

    // Welcome message management
    Route::apiResource('welcome-messages', WelcomeMessageController::class);
    Route::post('/welcome-messages/{welcome_message}', [WelcomeMessageController::class, 'update']); // For file uploads with method override
    Route::patch('/welcome-messages/{id}/toggle-active', [WelcomeMessageController::class, 'toggleActive']);

    // FAQ management (keeping other routes protected)
    Route::post('/faqs', [FAQController::class, 'store']);
    Route::get('/faqs/{faq}', [FAQController::class, 'show']);
    Route::put('/faqs/{faq}', [FAQController::class, 'update']);
    Route::delete('/faqs/{faq}', [FAQController::class, 'destroy']);
    Route::patch('/faqs/{faq}/toggle-status', [FAQController::class, 'toggleStatus']);
    Route::patch('/faqs/bulk-status', [FAQController::class, 'bulkUpdateStatus']);
    Route::delete('/faqs/bulk', [FAQController::class, 'bulkDelete']);
    Route::get('/faqs/analytics', [FAQController::class, 'analytics']);
    Route::get('/faqs/export', [FAQController::class, 'export']);

    // Gallery management
    Route::get('/gallery', [GalleryController::class, 'index']);
    Route::post('/gallery', [GalleryController::class, 'store']);
    Route::get('/gallery/{gallery}', [GalleryController::class, 'show']);
    Route::put('/gallery/{gallery}', [GalleryController::class, 'update']);
    Route::patch('/gallery/{gallery}', [GalleryController::class, 'update']);
    Route::post('/gallery/{gallery}', [GalleryController::class, 'update']); // For file uploads with method override
    Route::delete('/gallery/{gallery}', [GalleryController::class, 'destroy']);
    Route::post('/gallery/reorder', [GalleryController::class, 'reorder']);
    Route::patch('/gallery/{gallery}/toggle-status', [GalleryController::class, 'toggleStatus']);
    Route::patch('/gallery/{gallery}/toggle-featured', [GalleryController::class, 'toggleFeatured']);

    // Website Services management
    Route::get('/website-services', [WebsiteServiceController::class, 'index']);
    Route::post('/website-services', [WebsiteServiceController::class, 'store']);
    Route::get('/website-services/{website_service}', [WebsiteServiceController::class, 'show']);
    Route::put('/website-services/{website_service}', [WebsiteServiceController::class, 'update']);
    Route::patch('/website-services/{website_service}', [WebsiteServiceController::class, 'update']);
    Route::post('/website-services/{website_service}', [WebsiteServiceController::class, 'update']); // For file uploads with method override
    Route::delete('/website-services/{website_service}', [WebsiteServiceController::class, 'destroy']);
    Route::post('/website-services/reorder', [WebsiteServiceController::class, 'updateOrder']);
    Route::patch('/website-services/{website_service}/toggle-status', [WebsiteServiceController::class, 'toggleStatus']);
    Route::patch('/website-services/{website_service}/toggle-featured', [WebsiteServiceController::class, 'toggleFeatured']);

    // Muhimu Section Management
    Route::apiResource('announcements', AnnouncementController::class);
    Route::post('/announcements/{announcement}', [AnnouncementController::class, 'update']); // For file uploads with method override
    Route::patch('/announcements/{announcement}/toggle-status', [AnnouncementController::class, 'toggleStatus']);
    Route::post('/announcements/reorder', [AnnouncementController::class, 'reorder']);

    Route::apiResource('videos', VideoController::class);
    Route::patch('/videos/{video}/toggle-status', [VideoController::class, 'toggleStatus']);
    Route::patch('/videos/{video}/toggle-main', [VideoController::class, 'toggleMain']);
    Route::post('/videos/reorder', [VideoController::class, 'reorder']);

    Route::apiResource('downloads', DownloadController::class);
    Route::post('/downloads/{download}', [DownloadController::class, 'update']); // For file uploads with method override
    Route::patch('/downloads/{download}/toggle-status', [DownloadController::class, 'toggleStatus']);
    Route::post('/downloads/reorder', [DownloadController::class, 'reorder']);








         // Contact office management (temporarily public for testing)
     // Route::get('/contact/offices', [ContactController::class, 'index']);
     // Route::post('/contact/offices', [ContactController::class, 'store']);
     // Route::get('/contact/offices/{contact}', [ContactController::class, 'show']);
     // Route::put('/contact/offices/{contact}', [ContactController::class, 'update']);
     // Route::post('/contact/offices/{contact}', [ContactController::class, 'update']); // For method override
     // Route::delete('/contact/offices/{contact}', [ContactController::class, 'destroy']);
     // Route::patch('/contact/offices/{contact}/toggle-status', [ContactController::class, 'toggleStatus']);
 });
