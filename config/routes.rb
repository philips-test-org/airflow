Rails.application.routes.draw do
  get 'unauthorized' => "unauthorized#index"
  get 'main' => "main#index"
  get 'horizontal' => "main#horizontal"
  get 'exam' => "main#exam"
  get 'exams' => "main#exams"
  get 'relative' => "relative#index"
  get 'about' => "main#about"
  get 'help' => "main#help"
  get 'cards' => "card_design#index"
  root :to => redirect('main')
end
