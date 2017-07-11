module OrmConverter


  # def self.exam_with_comment(employee,comment)
  #   {employee_id: employee.getId,
  #    employee: {name: employee.name},
  #    created_at: Time.now.to_i*1000,
  #    comment: comment}
  # end

  def self.limited_exams(exams,em)
    tree = {
      :rad_exam_time => {},
      :resource => {:modality => {}},
      :procedure => {},
      :current_status => {:universal_event_type => {}}
    }
    exams.inject([]) do |list,exam|
      hash = get_data(tree,exam,{})
      hash.merge!(ExamAdjustment.info_for(exam,em))
      hash.delete("accession")
      hash["events"] = []
      list << hash
      list
    end
  end

  def self.exams(exams,em)
    tree = {
      :rad_exam_time => {},
      :rad_exam_personnel => {},
      :rad_exam_detail => {},
      :procedure => {},
      :patient_mrn => {:patient => {}},
      :resource => {:modality => {}},
      :site_class => {:patient_type => {}},
      :current_status => {:universal_event_type => {}},
      :site_sublocation => {:site_location => {}},
      :order => {}
    }
    exams.inject([]) do |list,exam|
      hash = get_data(tree,exam,{})
      hash.merge!(ExamAdjustment.info_for(exam,em))
      list << hash
      list
    end
  end

  def self.resources(resources)
    sub_objects = {:modality => {}}
    resources.inject([]) do |list,resource|
      list << get_data(sub_objects,resource)
      list
    end
  end

  def self.get_data(tree,obj,acc_hash={})
    hash = attributes(obj)
    tree.keys.each do |key|
      if obj
        hash[key] = get_data(tree[key],obj.send(key),hash)
      end
    end
    hash
  end

  def self.attributes(obj)
    if obj
      obj.class.tableData.keys.delete_if {|k| k =~ /^ref\:/ }.inject({}) do |hash,attr|
        value = obj.send(attr)
        klass = value.class
        if klass == Java::JavaSql::Timestamp
          hash[attr] = value.getTime
        elsif klass == Java::JavaSql::Date
          hash[attr] = value.to_s
        else
          hash[attr] = value
        end
        hash
      end
    else
      {}
    end
  end

end
