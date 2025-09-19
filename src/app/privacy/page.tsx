export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Политика конфиденциальности
        </h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
          </p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              1. Сбор информации
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Мы собираем информацию, которую вы предоставляете добровольно при:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 mb-4">
              <li>Заполнении форм обратной связи</li>
              <li>Заказе консультаций</li>
              <li>Подписке на обновления</li>
              <li>Использовании интерактивных элементов сайта</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              2. Использование данных
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Собранная информация используется для:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 mb-4">
              <li>Предоставления запрашиваемых услуг</li>
              <li>Связи с вами по вопросам консультаций</li>
              <li>Улучшения качества сайта и услуг</li>
              <li>Соблюдения правовых требований</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              3. Файлы cookie
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Мы используем файлы cookie для улучшения работы сайта и анализа посещаемости. 
              Вы можете отключить cookie в настройках браузера.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              4. Безопасность
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Мы применяем современные методы защиты данных, включая шифрование 
              и безопасные протоколы передачи информации.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              5. Контакты
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              По вопросам конфиденциальности обращайтесь: 
              <a href="mailto:privacy@volkovchain.dev" className="text-primary hover:underline">
                privacy@volkovchain.dev
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}