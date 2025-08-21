import image1 from "@/assets/ZelijeHome/image22.jpg";
import image2 from "@/assets/ZelijeHome/Image29.jpg";
import type React from "react";
import { useTranslation } from 'react-i18next';

const Section: React.FC = () => {
    const { t } = useTranslation();

    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="gap-16 items-center py-8 px-4 mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 lg:py-16 lg:px-6">
                <div className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
                    <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                        {t('section.title')}
                    </h2>
                    <p className="mb-4">{t('section.description1')}</p>
                    <p>{t('section.description2')}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-8">
                    <img className="w-full rounded-lg" src={image1} alt={t('section.image1Alt')} />
                    <img className="mt-4 w-full lg:mt-10 rounded-lg" src={image2} alt={t('section.image2Alt')} />
        </div>
    </div>
</section>)
}
export default Section;