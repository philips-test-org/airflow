module ApplicationHelper

  def parse_time(java_sql_time)
    Time.parse(java_sql_time.to_s) if java_sql_time
  end

  def formatd(time_object)
    #Month ('Jan'), Day ('1..31'), Hour (00..23):Minute (00..59)
    parse_time(time_object).strftime("%b %e, %H:%M") if time_object
  end

  def age(time_object)
    distance_of_time_in_words(Time.now,parse_time(time_object)) if time_object
  end

end
