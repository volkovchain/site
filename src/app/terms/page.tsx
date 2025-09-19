export default function TermsPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Условия использования
        </h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
          </p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              1. Принятие условий
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Используя данный веб-сайт, вы соглашаетесь с настоящими условиями использования.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              2. Использование сайта
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Сайт предназначен для:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 mb-4">
              <li>Получения информации о блокчейн-разработке</li>
              <li>Изучения интерактивной таблицы криптовалют</li>
              <li>Заказа консультационных услуг</li>
              <li>Просмотра образовательного контента</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              3. Консультационные услуги
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Консультации предоставляются на основе опыта и знаний. 
              Результаты не гарантируются, но мы стремимся к максимальному качеству.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              4. Интеллектуальная собственность
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Все материалы сайта защищены авторскими правами. 
              Использование возможно только с разрешения автора.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              5. Ограничение ответственности
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Информация предоставляется "как есть". Мы не несем ответственности 
              за решения, принятые на основе информации с сайта.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              6. Контакты
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              По вопросам условий использования: 
              <a href="mailto:legal@volkovchain.dev" className="text-primary hover:underline">
                legal@volkovchain.dev
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}