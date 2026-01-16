<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\DirectorGeneral;

class DirectorGeneralSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DirectorGeneral::create([
            'name' => 'Mamlaka ya Serikali Mtandao',
            'title' => 'Ujumbe wa Mkurugenzi Mkuu',
            'message' => "Napenda kuchukua fursa hii kuwasalimu kwa jina la Serikali ya Mapinduzi ya Zanzibar na kuwashukuru kwa ushirikiano wenu katika jitihada zetu za kuimarisha matumizi ya TEHAMA katika utoaji wa huduma za umma. Serikali Mtandao ni chombo muhimu kinachowezesha mabadiliko ya kisera, kiutendaji, na kiteknolojia kwa lengo la kuleta ufanisi, uwazi, uwajibikaji, na utoaji wa huduma bora kwa wananchi.

Katika miaka ya hivi karibuni, tumeshuhudia maendeleo makubwa katika sekta ya Serikali Mtandao. Tumeendelea kushirikiana na taasisi za umma na kufanikiwa kutengeneza mifumo mbalimbali kama vile mfumo wa Bajeti na Matumizi Serikalini (BAMAS), Usimamizi wa Rasimali za Taasisi Kielektroniki (ERMS), mfumo wa Malipo ya Serikali (ZanMalipo), mfumo wa Utambuzi wa Watumishi (HRMIS), pamoja na mifumo ya usajili na utoaji wa huduma kwa wananchi. Mifumo hii imeboresha kwa kiasi kikubwa namna ambavyo taasisi za umma zinatoa huduma, huku ikipunguza urasimu na kuongeza ufanisi.

Aidha, kupitia ushirikiano na wadau wa maendeleo na sekta binafsi, Serikali Mtandao imeendelea kusimamia ujenzi wa miundombinu ya TEHAMA ikiwemo miundombinu ya intaneti serikalini (eGovernment Network), na matumizi ya hifadhidata ya pamoja (Shared Services Sytems \"Zan X-Change\") pamoja na ZanPortal. Juhudi hizi zote zina lengo la kujenga msingi imara wa huduma za kidijitali zinazowafikia wananchi kwa urahisi, haraka, na kwa gharama nafuu.

Tunaendelea kuhamasisha matumizi ya huduma za Serikali kwa njia ya mtandao kupitia tovuti, simu za mkononi, na Vituo vya huduma za TEHAMA kwa Wananchi (Community ICT Centers). Tunatambua kuwa maendeleo haya hayawezi kufikiwa bila ushiriki wa wananchi na taasisi zote za Serikali. Hivyo basi, ninatoa wito kwa kila taasisi kuhakikisha inaweka mikakati madhubuti ya TEHAMA, inatumia mifumo iliyopo kikamilifu, na inashiriki kikamilifu katika mchakato wa mabadiliko ya kidijitali.

Serikali Mtandao itaendelea kujenga uwezo wa kitaalamu kwa watumishi wa umma, kuratibu maendeleo ya sera na miongozo ya TEHAMA, na kuhakikisha kuwa Zanzibar inaenda sambamba na mapinduzi ya nne ya viwanda kwa kutumia teknolojia za kisasa kama vile akili mnemba (Al), data kubwa (Big Data), na blockchain kwa maendeleo ya kijamii na kiuchumi.

Kwa pamoja, tutaweza kuifikisha Zanzibar mahali pa juu zaidi katika matumizi ya TEHAMA kwa maendeleo endelevu ya Taifa letu.

Ahsante
Mamlaka ya Serikali Mtandao
Zanzibar",
            'image_path' => null,
            'additional_data' => null,
            'status' => 'active',
            'order' => 1
        ]);
    }
}
