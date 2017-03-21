module OrmConverter

  def self.exams(exams)
    sub_objects = {:rad_exam_time => {},
                   :rad_exam_personnel => {},
                   :rad_exam_detail => {},
                   :procedure => {},
                   :patient_mrn => {:patient => {}},
                   :resource => {:modality => {}},
                   :site_class => {:patient_type => {}}
                  }
    exams.inject([]) do |list,exam|
      list << get_data(sub_objects,exam,{})
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
      hash[key] = get_data(tree[key],obj.send(key),hash)
    end
    hash
  end

  def self.attributes(obj)
    obj.class.tableData.keys.delete_if {|k| k =~ /^ref\:/ }.inject({}) do |hash,attr|
      if obj.send(attr).class == Java::JavaSql::Timestamp
        hash[attr] = obj.send(attr).getTime
      else
        hash[attr] = obj.send(attr)
      end
      hash
    end
  end

end
