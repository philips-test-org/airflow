Rails.application.routes.draw do
  get 'unauthorized' => "unauthorized#index"
  get 'main' => "main#index"
  get 'about' => "main#about"
  get 'help' => "main#help"
  root :to => redirect('main')
end
